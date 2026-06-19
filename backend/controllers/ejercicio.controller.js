const { EjercicioModel } = require('../models/ejercicio.model');
const { RutinaEjercicioModel } = require('../models/rutina_ejercicio.model');
const { EntrenamientoEjercicioModel } = require('../models/entrenamiento_ejercicio.model');
const { EntrenamientoModel } = require('../models/entrenamiento.model');

const getAllEjercicios = async (req, res, next) => {
  try {
    const ejercicios = await EjercicioModel.findAllEjercicios();

    if (ejercicios.length === 0) {
      return res.status(404).json({
        msg: 'No se encontraron ejercicios cargados en el sistema'
      });
    }
    return res.status(200).json(ejercicios);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getEjercicioById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const ejercicio = await EjercicioModel.findById(Number(id));

    if (!ejercicio) {
      return res.status(404).json({
        msg: `No se encontró el ejercicio con el id ${id}`
      });
    }
    return res.status(200).json(ejercicio);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const postNewEjercicio = async (req, res, next) => {
  try {
    const { nombre, tipo } = req.body;
    const nuevoEjercicio = await EjercicioModel.createEjercicio({ nombre, tipo });
    return res.status(201).json({
      msg: 'Ejercicio creado correctamente',
      ejercicio: nuevoEjercicio
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, tipo } = req.body;
    const ejercicio = await EjercicioModel.updateEjercicio(Number(id), { nombre, tipo });

    if (!ejercicio) {
      return res.status(404).json({ msg: `No se encontró el ejercicio con el id ${id}` });
    }

    return res.status(200).json({ msg: 'Ejercicio actualizado correctamente', ejercicio });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enRutinas = await RutinaEjercicioModel.count({
      where: { ejercicio_id: id }
    });
    const enEntrenamientos = await EntrenamientoEjercicioModel.count({
      where: { ejercicio_id: id }
    });

    if (enRutinas > 0 || enEntrenamientos > 0) {
      return res.status(400).json({
        errors: ['No se puede eliminar el ejercicio porque está siendo usado en rutinas o entrenamientos']
      });
    }

    const deleted = await EjercicioModel.deleteEjercicio(Number(id));

    if (!deleted) {
      return res.status(404).json({ msg: `No se encontró el ejercicio con el id ${id}` });
    }

    return res.status(200).json({ msg: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getProgresoEjercicio = async (req, res, next) => {
  const { id } = req.params;
  try {
    const ejercicio = await EjercicioModel.findById(Number(id));
    if (!ejercicio) {
      return res.status(404).json({ msg: `No se encontró el ejercicio con el id ${id}` });
    }

    const progreso = await EntrenamientoEjercicioModel.findAll({
      where: { ejercicio_id: id },
      attributes: ['series_realizadas', 'repeticiones_realizadas', 'peso_usado'],
      include: [
        {
          model: EntrenamientoModel,
          attributes: ['fecha', 'notas'],
        },
      ],
      order: [[EntrenamientoModel, 'fecha', 'DESC']],
    });

    if (progreso.length === 0) {
      return res.status(404).json({ msg: `No hay entrenamientos registrados para el ejercicio con id ${id}` });
    }

    return res.status(200).json({
      ejercicio,
      progreso,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getEjerciciosByTipo = async (req, res, next) => {
  const { tipo } = req.params;
  try {
    const ejercicios = await EjercicioModel.findByTipo(tipo);

    if (ejercicios.length === 0) {
      return res.status(404).json({ msg: `No se encontraron ejercicios del tipo ${tipo}` });
    }

    return res.status(200).json(ejercicios);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCountEjercicios = async (req, res, next) => {
  try {
    const count = await EjercicioModel.countEjercicios();
    return res.status(200).json({ total: count });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getAllEjercicios, getEjercicioById, postNewEjercicio, updateEjercicio, deleteEjercicio, getProgresoEjercicio, getEjerciciosByTipo, getCountEjercicios };
