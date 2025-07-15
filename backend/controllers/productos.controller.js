const pool = require('../db');

// Obtener todos los productos
const getAllProductos = async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            'SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id'
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

// Obtener un producto por ID
const getProductoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            'SELECT p.*, c.nombre as categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = $1',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Crear un nuevo producto
const createProducto = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, stock, categoria_id } = req.body;
        
        const { rows } = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, precio, stock, categoria_id]
        );
        
        // Registrar movimiento de inventario
        await pool.query(
            'INSERT INTO movimientos_producto (producto_id, tipo_movimiento, cantidad, motivo) VALUES ($1, $2, $3, $4)',
            [rows[0].id, 'entrada', stock, 'Creación de producto']
        );
        
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Actualizar un producto
const updateProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria_id } = req.body;
        
        // Obtener stock actual para comparar
        const { rows: currentRows } = await pool.query(
            'SELECT stock FROM productos WHERE id = $1',
            [id]
        );
        
        if (currentRows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        const currentStock = currentRows[0].stock;
        const stockDifference = stock - currentStock;
        
        const { rows } = await pool.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5 WHERE id = $6 RETURNING *',
            [nombre, descripcion, precio, stock, categoria_id, id]
        );
        
        // Registrar movimiento si hay cambio en el stock
        if (stockDifference !== 0) {
            const movimientoTipo = stockDifference > 0 ? 'entrada' : 'salida';
            await pool.query(
                'INSERT INTO movimientos_producto (producto_id, tipo_movimiento, cantidad, motivo) VALUES ($1, $2, $3, $4)',
                [id, movimientoTipo, Math.abs(stockDifference), 'Actualización de producto']
            );
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

// Eliminar un producto (lógico - actualiza estado en lugar de borrar)
const deleteProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // En lugar de borrar, podrías agregar un campo "activo" y actualizarlo
        const { rowCount } = await pool.query(
            'DELETE FROM productos WHERE id = $1',
            [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
};