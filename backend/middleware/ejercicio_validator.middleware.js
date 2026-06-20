const validateInputEjercicios = (req, res, next) => {
  const { nombre, tipo } = req.body;
  const errors = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('Nombre es requerido y debe ser un texto');
  }

  if (!tipo || typeof tipo !== 'string' || tipo.trim() === '') {
    errors.push('Tipo es requerido y debe ser un texto');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateInputEjercicios }