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
const validarCampos = require('../middlewares/validarCampos'); // Middleware para manejar errores de validación

// ✅ Validaciones para crear categoría
const validarCrearCategoria = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
  validarCampos
];

// ✅ Validaciones para actualizar categoría
const validarActualizarCategoria = [
  param('id').isInt().withMessage('ID inválido'),
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres'),
  validarCampos
];

// ✅ Validación simple para eliminar (solo validación de ID)
const validarEliminarCategoria = [
  param('id').isInt().withMessage('ID inválido'),
  validarCampos
];

// 🌐 Rutas públicas
router.get('/', getAllCategorias);
router.get('/:id', param('id').isInt(), validarCampos, getCategoriaById);

// 🔐 Rutas protegidas (con autenticación y autorización de admin)
router.post('/', auth, adminAuth, validarCrearCategoria, createCategoria);
router.put('/:id', auth, adminAuth, validarActualizarCategoria, updateCategoria);
router.delete('/:id', auth, adminAuth, validarEliminarCategoria, deleteCategoria);

module.exports = router;
