const pool = require('../db');

const getAllCategorias = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categorias ORDER BY nombre');
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

const getCategoriaById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const createCategoria = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        // Verificar si ya existe una categoría con ese nombre
        const { rows: existentes } = await pool.query(
            'SELECT id FROM categorias WHERE LOWER(nombre) = LOWER($1) LIMIT 1',
            [nombre]
        );
        if (existentes.length > 0) {
            return res.status(400).json({ message: 'La categoría ya existe' });
        }
        const { rows } = await pool.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre, descripcion || null]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const { rows } = await pool.query(
            'UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
            [nombre, descripcion || null, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
};

const deleteCategoria = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar si hay productos asociados
        const { rows: productos } = await pool.query(
            'SELECT id FROM productos WHERE categoria_id = $1 LIMIT 1',
            [id]
        );
        
        if (productos.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar la categoría porque tiene productos asociados' 
            });
        }
        
        const { rowCount } = await pool.query(
            'DELETE FROM categorias WHERE id = $1',
            [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        res.json({ message: 'Categoría eliminada' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};