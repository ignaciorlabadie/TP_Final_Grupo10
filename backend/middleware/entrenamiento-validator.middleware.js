const validateInputEntrenamiento = (req, res, next) => {
  const { rutina_id, fecha, duracion_real, ejercicios } = req.body;
  const errors = [];

  if (!rutina_id || typeof rutina_id !== 'number') {
    errors.push('rutina_id es requerido y debe ser un número');
  }

  if (fecha && isNaN(Date.parse(fecha))) {
    errors.push('fecha debe ser una fecha válida');
  }

  if (duracion_real !== undefined && (typeof duracion_real !== 'number' || duracion_real < 1)) {
    errors.push('duracion_real debe ser un número mayor a 0');
  }

  if (ejercicios !== undefined) {
    if (!Array.isArray(ejercicios)) {
      errors.push('ejercicios debe ser un arreglo');
    } else if (ejercicios.length === 0) {
      errors.push('Debe incluir al menos un ejercicio en el entrenamiento');
    } else {
      ejercicios.forEach((ej, index) => {
        if (!ej.ejercicio_id || typeof ej.ejercicio_id !== 'number') {
          errors.push(`Ejercicio en posición ${index}: ejercicio_id es requerido y debe ser un número`);
        }
        if (ej.series_realizadas !== undefined && (typeof ej.series_realizadas !== 'number' || ej.series_realizadas < 1)) {
          errors.push(`Ejercicio en posición ${index}: series_realizadas debe ser un número mayor a 0`);
        }
        if (ej.repeticiones_realizadas !== undefined && (typeof ej.repeticiones_realizadas !== 'number' || ej.repeticiones_realizadas < 1)) {
          errors.push(`Ejercicio en posición ${index}: repeticiones_realizadas debe ser un número mayor a 0`);
        }
      });
    }
  } else {
    errors.push('Debe incluir al menos un ejercicio en el entrenamiento');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validateInputEntrenamiento };
