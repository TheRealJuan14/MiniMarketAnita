const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
const {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} = require('../controllers/productos.controller');

// Rutas públicas
router.get('/', getAllProductos);
router.get('/:id', getProductoById);

// Rutas protegidas (requieren autenticación)
router.post('/', auth, adminAuth, createProducto);
router.put('/:id', auth, adminAuth, updateProducto);
router.delete('/:id', auth, adminAuth, deleteProducto);

module.exports = router;