const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
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

router.post('/', auth, adminAuth, validarCrearFactura, createFacturaCompra);
router.get('/', auth, adminAuth, getFacturasCompra);
router.get('/:id', auth, adminAuth, param('id').isInt(), getDetalleFacturaCompra);

module.exports = router;