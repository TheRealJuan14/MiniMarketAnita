const pool = require('../db');

const getAllProveedores = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM proveedores ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getProveedorById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const createProveedor = async (req, res, next) => {
    try {
        const { nombre, telefono, direccion } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO proveedores (nombre, telefono, direccion) VALUES ($1, $2, $3) RETURNING *',
            [nombre, telefono, direccion]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateProveedor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, direccion } = req.body;
        
        const { rows } = await pool.query(
            'UPDATE proveedores SET nombre = $1, telefono = $2, direccion = $3 WHERE id = $4 RETURNING *',
            [nombre, telefono, direccion, id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const deleteProveedor = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar si el proveedor tiene facturas asociadas
        const { rows: facturas } = await pool.query(
            'SELECT id FROM facturas_compra WHERE proveedor_id = $1 LIMIT 1',
            [id]
        );
        
        if (facturas.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el proveedor porque tiene facturas asociadas' 
            });
        }
        
        const { rowCount } = await pool.query(
            'DELETE FROM proveedores WHERE id = $1',
            [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        
        res.json({ message: 'Proveedor eliminado' });
    } catch (err) {
        next(err);
    }
};

// Obtener movimientos de un proveedor
const getMovimientosProveedor = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar si el proveedor existe
        const { rows: proveedor } = await pool.query(
            'SELECT id FROM proveedores WHERE id = $1',
            [id]
        );
        
        if (proveedor.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        
        const { rows: movimientos } = await pool.query(
            'SELECT * FROM movimiento_proveedor WHERE proveedor_id = $1 ORDER BY fecha DESC',
            [id]
        );
        
        res.json(movimientos);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    getMovimientosProveedor
};