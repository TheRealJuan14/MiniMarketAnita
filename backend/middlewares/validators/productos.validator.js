const { body, param } = require('express-validator');

const productoValidator = {
    createProducto: [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0'),
        body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
        body('categoria_id').optional().isInt().withMessage('La categoría debe ser un ID válido')
    ],
    updateProducto: [
        param('id').isInt().withMessage('ID inválido'),
        body('nombre').optional().notEmpty().withMessage('El nombre es requerido'),
        body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0'),
        body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
        body('categoria_id').optional().isInt().withMessage('La categoría debe ser un ID válido')
    ],
    getProductoById: [
        param('id').isInt().withMessage('ID inválido')
    ],
    deleteProducto: [
        param('id').isInt().withMessage('ID inválido')
    ]
};

module.exports = productoValidator;