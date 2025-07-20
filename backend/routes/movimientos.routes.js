const express = require('express');
const router = express.Router();
// Middlewares de autenticación eliminados
const {
    getMovimientosProducto,
    registrarMovimientoProducto
} = require('../controllers/movimientos.controller');
const { body, query } = require('express-validator');

// Validaciones
const validarMovimientoProducto = [
    body('producto_id').isInt().withMessage('ID de producto inválido'),
    body('tipo_movimiento').isIn(['entrada', 'salida']).withMessage('Tipo de movimiento inválido'),
    body('cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
    body('motivo').optional().isLength({ max: 255 }).withMessage('Máximo 255 caracteres')
];

router.get('/productos', [
    query('producto_id').optional().isInt(),
    query('tipo').optional().isIn(['entrada', 'salida']),
    query('fecha_inicio').optional().isISO8601(),
    query('fecha_fin').optional().isISO8601()
], getMovimientosProducto);

router.post('/productos', validarMovimientoProducto, registrarMovimientoProducto);

module.exports = router;