const pool = require('../db');

const createFacturaCompra = async (req, res, next) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const { proveedor_id, detalles } = req.body;
        
        // Validar que detalles sea un array y tenga al menos un elemento
        if (!Array.isArray(detalles) || detalles.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'El campo detalles debe ser un array con al menos un producto.' });
        }
        
        // Validar que el proveedor exista
        const { rows: proveedores } = await client.query(
            'SELECT id FROM proveedores WHERE id = $1',
            [proveedor_id]
        );
        if (proveedores.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'El proveedor no existe.' });
        }
        
        // Calcular total
        let total = 0;
        for (const detalle of detalles) {
            total += detalle.precio_unitario * detalle.cantidad;
        }
        
        // Insertar factura
        const { rows: facturaRows } = await client.query(
            'INSERT INTO facturas_compra (proveedor_id, total) VALUES ($1, $2) RETURNING *',
            [proveedor_id, total]
        );
        
        const facturaId = facturaRows[0].id;
        
        // Insertar detalles y actualizar stock
        for (const detalle of detalles) {
            const subtotal = detalle.precio_unitario * detalle.cantidad;
            
            await client.query(
                'INSERT INTO detalle_factura_compra (factura_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
                [facturaId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, subtotal]
            );
            
            // Actualizar stock
            await client.query(
                'UPDATE productos SET stock = stock + $1 WHERE id = $2',
                [detalle.cantidad, detalle.producto_id]
            );
            
            // Registrar movimiento
            await client.query(
                'INSERT INTO movimientos_producto (producto_id, tipo_movimiento, cantidad, motivo) VALUES ($1, $2, $3, $4)',
                [detalle.producto_id, 'entrada', detalle.cantidad, `Compra - Factura #${facturaId}`]
            );
        }
        
        // Registrar movimiento de proveedor
        await client.query(
            'INSERT INTO movimiento_proveedor (proveedor_id, tipo, monto, observacion) VALUES ($1, $2, $3, $4)',
            [proveedor_id, 'compra', total, `Factura #${facturaId}`]
        );
        
        await client.query('COMMIT');
        res.status(201).json(facturaRows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

const getFacturasCompra = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT f.*, p.nombre as proveedor_nombre ' +
            'FROM facturas_compra f ' +
            'JOIN proveedores p ON f.proveedor_id = p.id ' +
            'ORDER BY f.fecha DESC'
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getDetalleFacturaCompra = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Obtener cabecera
        const { rows: facturaRows } = await pool.query(
            'SELECT f.*, p.nombre as proveedor_nombre, p.telefono as proveedor_telefono ' +
            'FROM facturas_compra f ' +
            'JOIN proveedores p ON f.proveedor_id = p.id ' +
            'WHERE f.id = $1',
            [id]
        );
        
        if (facturaRows.length === 0) {
            return res.status(404).json({ message: 'Factura no encontrada' });
        }
        
        // Obtener detalles
        const { rows: detalleRows } = await pool.query(
            'SELECT d.*, pr.nombre as producto_nombre ' +
            'FROM detalle_factura_compra d ' +
            'JOIN productos pr ON d.producto_id = pr.id ' +
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
    createFacturaCompra,
    getFacturasCompra,
    getDetalleFacturaCompra
};