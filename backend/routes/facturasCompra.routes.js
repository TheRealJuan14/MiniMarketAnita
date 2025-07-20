const express = require('express');
const router = express.Router();
// Middlewares de autenticación eliminados
const {
    createFacturaCompra,
    getFacturasCompra,
    getDetalleFacturaCompra
} = require('../controllers/facturasCompra.controller');
const { body, param } = require('express-validator');

// Validaciones
const validarCrearFactura = [
    body('proveedor_id').isInt().withMessage('ID de proveedor inválido'),
    body('detalles').isArray({ min: 1 }).withMessage('Debe haber al menos un producto'),
    body('detalles.*.producto_id').isInt().withMessage('ID de producto inválido'),
    body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
    body('detalles.*.precio_unitario').isFloat({ min: 0 }).withMessage('Precio inválido')
];

router.post('/', validarCrearFactura, createFacturaCompra);
router.get('/', getFacturasCompra);
router.get('/:id', param('id').isInt(), getDetalleFacturaCompra);

module.exports = router;