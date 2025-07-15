// Validador para categorías
module.exports = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
  }
  next();
};
