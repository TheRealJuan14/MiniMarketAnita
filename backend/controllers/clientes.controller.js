const pool = require('../db');

const getAllClientes = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM clientes ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getClienteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const createCliente = async (req, res, next) => {
    try {
        const { nombre, telefono, direccion } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO clientes (nombre, telefono, direccion) VALUES ($1, $2, $3) RETURNING *',
            [nombre, telefono, direccion]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateCliente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, direccion } = req.body;
        
        const { rows } = await pool.query(
            'UPDATE clientes SET nombre = $1, telefono = $2, direccion = $3 WHERE id = $4 RETURNING *',
            [nombre, telefono, direccion, id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const deleteCliente = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar si el cliente tiene facturas asociadas
        const { rows: facturas } = await pool.query(
            'SELECT id FROM facturas_venta WHERE cliente_id = $1 LIMIT 1',
            [id]
        );
        
        if (facturas.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el cliente porque tiene facturas asociadas' 
            });
        }
        
        const { rowCount } = await pool.query(
            'DELETE FROM clientes WHERE id = $1',
            [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        res.json({ message: 'Cliente eliminado' });
    } catch (err) {
        next(err);
    }
};

// Obtener movimientos de un cliente
const getMovimientosCliente = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar si el cliente existe
        const { rows: cliente } = await pool.query(
            'SELECT id FROM clientes WHERE id = $1',
            [id]
        );
        
        if (cliente.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        const { rows: movimientos } = await pool.query(
            'SELECT * FROM movimiento_cliente WHERE cliente_id = $1 ORDER BY fecha DESC',
            [id]
        );
        
        res.json(movimientos);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    getMovimientosCliente
};