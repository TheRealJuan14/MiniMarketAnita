-- Tabla: categorias
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla: productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT REFERENCES categorias(id)
);

-- Tabla: formas_pago
CREATE TABLE formas_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla: usuarios (para login y registro)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT
);

-- Tabla: proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ruc VARCHAR(20) UNIQUE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- Tabla: movimientos_producto
CREATE TABLE movimientos_producto (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES productos(id),
    tipo_movimiento VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT
);

-- Tabla: facturas_venta
CREATE TABLE facturas_venta (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    usuario_id INT REFERENCES usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    forma_pago_id INT REFERENCES formas_pago(id)
);

-- Tabla: detalle_factura_venta
CREATE TABLE detalle_factura_venta (
    id SERIAL PRIMARY KEY,
    factura_id INT REFERENCES facturas_venta(id),
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Tabla: facturas_compra
CREATE TABLE facturas_compra (
    id SERIAL PRIMARY KEY,
    proveedor_id INT REFERENCES proveedores(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL
);

-- Tabla: detalle_factura_compra
CREATE TABLE detalle_factura_compra (
    id SERIAL PRIMARY KEY,
    factura_id INT REFERENCES facturas_compra(id),
    producto_id INT REFERENCES productos(id),
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Tabla: movimiento_cliente
CREATE TABLE movimiento_cliente (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    tipo VARCHAR(20) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacion TEXT
);

-- Tabla: movimiento_proveedor
CREATE TABLE movimiento_proveedor (
    id SERIAL PRIMARY KEY,
    proveedor_id INT REFERENCES proveedores(id),
    tipo VARCHAR(20) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacion TEXT
);
