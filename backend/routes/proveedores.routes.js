const express = require('express');
const router = express.Router();
// Middlewares de autenticación eliminados
const {
    getAllProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    getMovimientosProveedor
} = require('../controllers/proveedores.controller');
const { body, param } = require('express-validator');

// Validaciones
const validarProveedor = [
    body('nombre').notEmpty().withMessage('El nombre es requerido')
                 .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    body('telefono').optional().isLength({ max: 20 }).withMessage('Máximo 20 caracteres'),
    body('direccion').optional().isLength({ max: 255 }).withMessage('Máximo 255 caracteres')
];

// Rutas públicas
router.get('/', getAllProveedores);
router.get('/:id', param('id').isInt(), getProveedorById);

// Rutas protegidas
router.post('/', validarProveedor, createProveedor);
router.put('/:id', param('id').isInt(), validarProveedor, updateProveedor);
router.delete('/:id', param('id').isInt(), deleteProveedor);

// Movimientos del proveedor
router.get('/:id/movimientos', param('id').isInt(), getMovimientosProveedor);

module.exports = router;