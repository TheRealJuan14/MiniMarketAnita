const express = require('express');
const router = express.Router();
// Middlewares de autenticación eliminados
const {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} = require('../controllers/productos.controller');

// Rutas públicas

// Rutas públicas
router.get('/', getAllProductos);
router.get('/:id', getProductoById);

// Rutas protegidas (requieren autenticación)
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);


module.exports = router;