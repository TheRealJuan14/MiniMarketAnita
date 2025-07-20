const express = require('express');
const router = express.Router();
// Middlewares de autenticación eliminados
const {
    getAllFormasPago,
    getFormaPagoById,
    createFormaPago,
    updateFormaPago,
    deleteFormaPago
} = require('../controllers/formasPago.controller');
const { body, param } = require('express-validator');

// Validaciones
const validarFormaPago = [
    body('nombre').notEmpty().withMessage('El nombre es requerido')
                 .isLength({ max: 50 }).withMessage('Máximo 50 caracteres')
];

// Rutas públicas
router.get('/', getAllFormasPago);
router.get('/:id', param('id').isInt(), getFormaPagoById);

// Rutas protegidas (solo admin)
router.post('/', validarFormaPago, createFormaPago);
router.put('/:id', param('id').isInt(), validarFormaPago, updateFormaPago);
router.delete('/:id', param('id').isInt(), deleteFormaPago);

module.exports = router;