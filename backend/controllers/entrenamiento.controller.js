const { Entrenamiento, EntrenamientoEjercicio, Rutina, Ejercicio } = require('../models');

const getAllEntrenamientos = async (req, res, next) => {
  try {
    const entrenamientos = await Entrenamiento.findAll({
      include: [
        {
          model: Rutina,
          attributes: ['id', 'nombre'],
        },
        {
          model: EntrenamientoEjercicio,
          include: [
            {
              model: Ejercicio,
              attributes: ['id', 'nombre', 'tipo'],
            },
          ],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    if (entrenamientos.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron entrenamientos registrados' });
    }
    return res.status(200).json(entrenamientos);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getEntrenamientoById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const entrenamiento = await Entrenamiento.findByPk(Number(id), {
      include: [
        {
          model: Rutina,
          attributes: ['id', 'nombre'],
        },
        {
          model: EntrenamientoEjercicio,
          include: [
            {
              model: Ejercicio,
              attributes: ['id', 'nombre', 'tipo'],
            },
          ],
        },
      ],
    });

    if (!entrenamiento) {
      return res.status(404).json({ msg: `No se encontró el entrenamiento con el id ${id}` });
    }
    return res.status(200).json(entrenamiento);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const postNewEntrenamiento = async (req, res, next) => {
  try {
    const { rutina_id, fecha, duracion_real, notas, ejercicios } = req.body;

    const rutina = await Rutina.findByPk(Number(rutina_id));
    if (!rutina) {
      return res.status(404).json({ msg: `No se encontró la rutina con el id ${rutina_id}` });
    }

    const nuevoEntrenamiento = await Entrenamiento.create({
      rutina_id,
      fecha: fecha || new Date(),
      duracion_real,
      notas,
    });

    if (ejercicios && ejercicios.length > 0) {
      const ejerciciosData = ejercicios.map((ej) => ({
        entrenamiento_id: nuevoEntrenamiento.id,
        ejercicio_id: ej.ejercicio_id,
        series_realizadas: ej.series_realizadas ?? 1,
        repeticiones_realizadas: ej.repeticiones_realizadas ?? 1,
        peso_usado: ej.peso_usado ?? null,
      }));
      await EntrenamientoEjercicio.bulkCreate(ejerciciosData);
    }

    const entrenamientoCompleto = await Entrenamiento.findByPk(nuevoEntrenamiento.id, {
      include: [
        {
          model: Rutina,
          attributes: ['id', 'nombre'],
        },
        {
          model: EntrenamientoEjercicio,
          include: [
            {
              model: Ejercicio,
              attributes: ['id', 'nombre', 'tipo'],
            },
          ],
        },
      ],
    });

    return res.status(201).json({
      msg: 'Entrenamiento registrado correctamente',
      entrenamiento: entrenamientoCompleto,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteEntrenamiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entrenamiento = await Entrenamiento.findByPk(Number(id));

    if (!entrenamiento) {
      return res.status(404).json({ msg: `No se encontró el entrenamiento con el id ${id}` });
    }

    await EntrenamientoEjercicio.destroy({ where: { entrenamiento_id: id } });
    await entrenamiento.destroy();

    return res.status(200).json({ msg: 'Entrenamiento eliminado correctamente' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getAllEntrenamientos, getEntrenamientoById, postNewEntrenamiento, deleteEntrenamiento };
