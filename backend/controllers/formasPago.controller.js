const pool = require('../db');

const getAllFormasPago = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM formas_pago ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getFormaPagoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM formas_pago WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const createFormaPago = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO formas_pago (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateFormaPago = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        
        const { rows } = await pool.query(
            'UPDATE formas_pago SET nombre = $1 WHERE id = $2 RETURNING *',
            [nombre, id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const deleteFormaPago = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar si la forma de pago está en uso
        const { rows: facturas } = await pool.query(
            'SELECT id FROM facturas_venta WHERE forma_pago_id = $1 LIMIT 1',
            [id]
        );
        
        if (facturas.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar la forma de pago porque está en uso' 
            });
        }
        
        const { rowCount } = await pool.query(
            'DELETE FROM formas_pago WHERE id = $1',
            [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Forma de pago no encontrada' });
        }
        
        res.json({ message: 'Forma de pago eliminada' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllFormasPago,
    getFormaPagoById,
    createFormaPago,
    updateFormaPago,
    deleteFormaPago
};