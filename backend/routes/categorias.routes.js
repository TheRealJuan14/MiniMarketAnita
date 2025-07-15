const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
const {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
} = require('../controllers/categorias.controller');
const { body, param } = require('express-validator');

// Validaciones
const validarCrearCategoria = [
    body('nombre').notEmpty().withMessage('El nombre es requerido')
                  .isLength({ max: 50 }).withMessage('Máximo 50 caracteres')
];

const validarActualizarCategoria = [
    param('id').isInt().withMessage('ID inválido'),
    body('nombre').notEmpty().withMessage('El nombre es requerido')
                  .isLength({ max: 50 }).withMessage('Máximo 50 caracteres')
];

// Rutas públicas
router.get('/', getAllCategorias);
router.get('/:id', param('id').isInt(), getCategoriaById);

// Rutas protegidas
router.post('/', auth, adminAuth, validarCrearCategoria, createCategoria);
router.put('/:id', auth, adminAuth, validarActualizarCategoria, updateCategoria);
router.delete('/:id', auth, adminAuth, param('id').isInt(), deleteCategoria);

module.exports = router;