const { RutinaModel, RutinaEjercicioModel, EjercicioModel } = require('../models');

const getAllRutinas = async (req, res, next) => {
  try {
    const rutinas = await RutinaModel.findAll({
      include: [
        {
          model: EjercicioModel,
          // El through para traer la tabla intermedia de rutina y ejercicios
          through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
        },
      ],
      order: [['createdAt', 'DESC']], // Ordena descendentemente por momento de creacion.
    });

    if (rutinas.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron rutinas cargadas en el sistema' });
    }
    return res.status(200).json(rutinas);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getRutinaById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rutina = await RutinaModel.findByPk(Number(id), {
      include: [
        {
          model: EjercicioModel,
          through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
        },
      ],
    });

    if (!rutina) {
      return res.status(404).json({ msg: `No se encontró la rutina con el id ${id}` });
    }
    return res.status(200).json(rutina);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const postNewRutina = async (req, res, next) => {
  try {
    const { nombre, descripcion, duracion_minutos, ejercicios } = req.body;

    const nuevaRutina = await RutinaModel.create({ nombre, descripcion, duracion_minutos });

    if (ejercicios && ejercicios.length > 0) {
      const ejerciciosData = ejercicios.map((ej, index) => ({
        rutina_id: nuevaRutina.id,
        ejercicio_id: ej.ejercicio_id,
        orden: ej.orden ?? index + 1,
        series: ej.series ?? 1,
        repeticiones: ej.repeticiones ?? 1,
        descanso_segundos: ej.descanso_segundos ?? 60,
      }));
      await RutinaEjercicioModel.bulkCreate(ejerciciosData); // Agregamos todos los ejercicios en la misma consulta
    }

    const rutinaCompleta = await RutinaModel.findByPk(nuevaRutina.id, {
      include: [
        {
          model: EjercicioModel,
          through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
        },
      ],
    });

    return res.status(201).json({
      msg: 'Rutina creada correctamente',
      rutina: rutinaCompleta,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateRutina = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion_minutos, ejercicios } = req.body;

    const rutina = await RutinaModel.findByPk(Number(id));
    if (!rutina) {
      return res.status(404).json({ msg: `No se encontró la rutina con el id ${id}` });
    }

    await rutina.update({ nombre, descripcion, duracion_minutos });

    if (ejercicios) {
      await RutinaEjercicioModel.destroy({ where: { rutina_id: id } });

      const ejerciciosData = ejercicios.map((ej, index) => ({
        rutina_id: Number(id),
        ejercicio_id: ej.ejercicio_id,
        orden: ej.orden ?? index + 1,
        series: ej.series ?? 1,
        repeticiones: ej.repeticiones ?? 1,
        descanso_segundos: ej.descanso_segundos ?? 60,
      }));
      await RutinaEjercicioModel.bulkCreate(ejerciciosData);
    }

    const rutinaActualizada = await RutinaModel.findByPk(Number(id), {
      include: [
        {
          model: EjercicioModel,
          through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
        },
      ],
    });

    return res.status(200).json({ msg: 'Rutina actualizada correctamente', rutina: rutinaActualizada });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteRutina = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rutina = await RutinaModel.findByPk(Number(id));

    if (!rutina) {
      return res.status(404).json({ msg: `No se encontró la rutina con el id ${id}` });
    }

    await RutinaEjercicioModel.destroy({ where: { rutina_id: id } });
    await rutina.destroy();

    return res.status(200).json({ msg: 'Rutina eliminada correctamente' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getAllRutinas, getRutinaById, postNewRutina, updateRutina, deleteRutina };
