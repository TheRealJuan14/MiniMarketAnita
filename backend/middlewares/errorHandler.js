const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Errores de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Error de validación',
            errors: err.errors
        });
    }
    
    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token no válido' });
    }
    
    // Error de duplicado (ej. email único)
    if (err.code === 11000) {
        return res.status(400).json({ message: 'El registro ya existe' });
    }
    
    res.status(err.status || 500).json({
        message: err.message || 'Error interno del servidor'
    });
};

module.exports = errorHandler;