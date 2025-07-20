const express = require('express');
const router = express.Router();
// Middlewares de autenticación eliminados
const {
    createFacturaVenta,
    getFacturasVenta,
    getDetalleFacturaVenta
} = require('../controllers/facturasVenta.controller');
const { body, param } = require('express-validator');

// Validaciones
const validarCrearFactura = [
    body('cliente_id').isInt().withMessage('ID de cliente inválido'),
    body('forma_pago_id').isInt().withMessage('ID de forma de pago inválido'),
    body('detalles').isArray({ min: 1 }).withMessage('Debe haber al menos un producto'),
    body('detalles.*.producto_id').isInt().withMessage('ID de producto inválido'),
    body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
    body('detalles.*.precio_unitario').isFloat({ min: 0 }).withMessage('Precio inválido')
];

router.post('/', validarCrearFactura, createFacturaVenta);
router.get('/', getFacturasVenta);
router.get('/:id', param('id').isInt(), getDetalleFacturaVenta);

module.exports = router;