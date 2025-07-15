const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
const {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    getMovimientosCliente
} = require('../controllers/clientes.controller');
const { body, param } = require('express-validator');

// Validaciones
const validarCliente = [
    body('nombre').notEmpty().withMessage('El nombre es requerido')
                 .isLength({ max: 100 }).withMessage('Máximo 100 caracteres'),
    body('telefono').optional().isLength({ max: 20 }).withMessage('Máximo 20 caracteres'),
    body('direccion').optional().isLength({ max: 255 }).withMessage('Máximo 255 caracteres')
];

// Rutas públicas
router.get('/', getAllClientes);
router.get('/:id', param('id').isInt(), getClienteById);

// Rutas protegidas
router.post('/', auth, adminAuth, validarCliente, createCliente);
router.put('/:id', auth, adminAuth, param('id').isInt(), validarCliente, updateCliente);
router.delete('/:id', auth, adminAuth, param('id').isInt(), deleteCliente);

// Movimientos del cliente
router.get('/:id/movimientos', auth, param('id').isInt(), getMovimientosCliente);

module.exports = router;
