const pool = require('../db');

// Crear factura de venta
const createFacturaVenta = async (req, res, next) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { cliente_id, forma_pago_id, detalles } = req.body;
        const usuario_id = req.user.id;
        
        // Validar que todos los productos tengan suficiente stock
        for (const detalle of detalles) {
            const { rows } = await client.query(
                'SELECT stock FROM productos WHERE id = $1 FOR UPDATE',
                [detalle.producto_id]
            );
            
            if (rows.length === 0) {
                throw new Error(`Producto con ID ${detalle.producto_id} no encontrado`);
            }
            
            if (rows[0].stock < detalle.cantidad) {
                throw new Error(`Stock insuficiente para el producto con ID ${detalle.producto_id}`);
            }
        }
        
        // Calcular total
        let total = 0;
        for (const detalle of detalles) {
            total += detalle.precio_unitario * detalle.cantidad;
        }
        
        // Insertar factura
        const { rows: facturaRows } = await client.query(
            'INSERT INTO facturas_venta (cliente_id, usuario_id, total, forma_pago_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [cliente_id, usuario_id, total, forma_pago_id]
        );
        
        const facturaId = facturaRows[0].id;
        
        // Insertar detalles y actualizar stock
        for (const detalle of detalles) {
            const subtotal = detalle.precio_unitario * detalle.cantidad;
            
            await client.query(
                'INSERT INTO detalle_factura_venta (factura_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [facturaId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, subtotal]
            );
            
            // Actualizar stock
            await client.query(
                'UPDATE productos SET stock = stock - $1 WHERE id = $2',
                [detalle.cantidad, detalle.producto_id]
            );
            
            // Registrar movimiento
            await client.query(
                'INSERT INTO movimientos_producto (producto_id, tipo_movimiento, cantidad, motivo) VALUES ($1, $2, $3, $4)',
                [detalle.producto_id, 'salida', detalle.cantidad, `Venta - Factura #${facturaId}`]
            );
        }
        
        // Registrar movimiento de cliente si es necesario
        if (forma_pago_id !== 1) { // Suponiendo que 1 es "Efectivo"
            await client.query(
                'INSERT INTO movimiento_cliente (cliente_id, tipo, monto, observacion) VALUES ($1, $2, $3, $4)',
                [cliente_id, 'deuda', total, `Factura #${facturaId}`]
            );
        }
        
        await client.query('COMMIT');
        res.status(201).json(facturaRows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

// Obtener todas las facturas de venta
const getFacturasVenta = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT f.*, c.nombre as cliente_nombre, u.nombre as usuario_nombre, fp.nombre as forma_pago ' +
            'FROM facturas_venta f ' +
            'JOIN clientes c ON f.cliente_id = c.id ' +
            'JOIN usuarios u ON f.usuario_id = u.id ' +
            'JOIN formas_pago fp ON f.forma_pago_id = fp.id ' +
            'ORDER BY f.fecha DESC'
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// Obtener detalles de una factura de venta
const getDetalleFacturaVenta = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Obtener cabecera
        const { rows: facturaRows } = await pool.query(
            'SELECT f.*, c.nombre as cliente_nombre, c.telefono as cliente_telefono, ' +
            'u.nombre as usuario_nombre, fp.nombre as forma_pago ' +
            'FROM facturas_venta f ' +
            'JOIN clientes c ON f.cliente_id = c.id ' +
            'JOIN usuarios u ON f.usuario_id = u.id ' +
            'JOIN formas_pago fp ON f.forma_pago_id = fp.id ' +
            'WHERE f.id = $1',
            [id]
        );
        
        if (facturaRows.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        
        // Obtener detalles
        const { rows: detalleRows } = await pool.query(
            'SELECT d.*, p.nombre as producto_nombre ' +
            'FROM detalle_factura_venta d ' +
            'JOIN productos p ON d.producto_id = p.id ' +
            'WHERE d.factura_id = $1',
            [id]
        );
        
        res.json({
            ...facturaRows[0],
            detalles: detalleRows
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createFacturaVenta,
    getFacturasVenta,
    getDetalleFacturaVenta
};