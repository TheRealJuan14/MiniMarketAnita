const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
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
router.post('/', auth, adminAuth, validarFormaPago, createFormaPago);
router.put('/:id', auth, adminAuth, param('id').isInt(), validarFormaPago, updateFormaPago);
router.delete('/:id', auth, adminAuth, param('id').isInt(), deleteFormaPago);

module.exports = router;