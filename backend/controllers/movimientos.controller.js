const pool = require('../db');

// Movimientos de productos
const getMovimientosProducto = async (req, res, next) => {
    try {
        const { producto_id, tipo, fecha_inicio, fecha_fin } = req.query;
        
        let query = 'SELECT m.*, p.nombre as producto_nombre FROM movimientos_producto m JOIN productos p ON m.producto_id = p.id';
        const params = [];
        let conditions = [];
        
        if (producto_id) {
            params.push(producto_id);
            conditions.push(`m.producto_id = $${params.length}`);
        }
        
        if (tipo) {
            params.push(tipo);
            conditions.push(`m.tipo_movimiento = $${params.length}`);
        }
        
        if (fecha_inicio) {
            params.push(fecha_inicio);
            conditions.push(`m.fecha >= $${params.length}`);
        }
        
        if (fecha_fin) {
            params.push(fecha_fin);
            conditions.push(`m.fecha <= $${params.length}`);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY m.fecha DESC';
        
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const registrarMovimientoProducto = async (req, res, next) => {
    try {
        const { producto_id, tipo_movimiento, cantidad, motivo } = req.body;
        
        // Verificar que el producto existe
        const { rows: producto } = await pool.query(
            'SELECT id FROM productos WHERE id = $1',
            [producto_id]
        );
        
        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        // Validar que no haya stock negativo
        if (tipo_movimiento === 'salida') {
            const { rows: stock } = await pool.query(
                'SELECT stock FROM productos WHERE id = $1',
                [producto_id]
            );
            
            if (stock[0].stock < cantidad) {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }
        }
        
        // Registrar movimiento
        const { rows } = await pool.query(
            'INSERT INTO movimientos_producto (producto_id, tipo_movimiento, cantidad, motivo) VALUES ($1, $2, $3, $4) RETURNING *',
            [producto_id, tipo_movimiento, cantidad, motivo]
        );
        
        // Actualizar stock
        const operacion = tipo_movimiento === 'entrada' ? '+' : '-';
        await pool.query(
            `UPDATE productos SET stock = stock ${operacion} $1 WHERE id = $2`,
            [cantidad, producto_id]
        );
        
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMovimientosProducto,
    registrarMovimientoProducto
};