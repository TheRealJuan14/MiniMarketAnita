const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productoRoutes = require('./routes/productos.routes');
const categoriaRoutes = require('./routes/categorias.routes');
const clienteRoutes = require('./routes/clientes.routes');
const proveedorRoutes = require('./routes/proveedores.routes');
const formaPagoRoutes = require('./routes/formasPago.routes');
const facturaVentaRoutes = require('./routes/facturasVenta.routes');
const facturaCompraRoutes = require('./routes/facturasCompra.routes');
const movimientoRoutes = require('./routes/movimientos.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/formas-pago', formaPagoRoutes);
app.use('/api/facturas-venta', facturaVentaRoutes);
app.use('/api/facturas-compra', facturaCompraRoutes);
app.use('/api/movimientos', movimientoRoutes);

// Manejador de errores
app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));