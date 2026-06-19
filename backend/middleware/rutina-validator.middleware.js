const validateInputRutinas = (req, res, next) => {
  const { nombre, ejercicios } = req.body;
  const errors = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('Nombre es requerido y debe ser un texto');
  }

  if (ejercicios !== undefined) {
    if (!Array.isArray(ejercicios)) {
      errors.push('Ejercicios debe ser un arreglo');
    } else if (ejercicios.length === 0) {
      errors.push('Debe incluir al menos un ejercicio en la rutina');
    } else {
      ejercicios.forEach((ej, index) => {
        if (!ej.ejercicio_id || typeof ej.ejercicio_id !== 'number') {
          errors.push(`Ejercicio en posición ${index}: ejercicio_id es requerido y debe ser un número`);
        }
        if (ej.series !== undefined && (typeof ej.series !== 'number' || ej.series < 1)) {
          errors.push(`Ejercicio en posición ${index}: series debe ser un número mayor a 0`);
        }
        if (ej.repeticiones !== undefined && (typeof ej.repeticiones !== 'number' || ej.repeticiones < 1)) {
          errors.push(`Ejercicio en posición ${index}: repeticiones debe ser un número mayor a 0`);
        }
      });
    }
  } else if (req.method === 'POST') {
    errors.push('Debe incluir al menos un ejercicio en la rutina');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateInputRutinas };
