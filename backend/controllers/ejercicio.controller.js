const { Ejercicio, EntrenamientoEjercicio, Entrenamiento } = require('../models');

const getAllEjercicios = async (req, res, next) => {
  try {
    const ejercicios = await Ejercicio.findAll();

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
    const ejercicio = await Ejercicio.findByPk(Number(id));

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
    const nuevoEjercicio = await Ejercicio.create({ nombre, tipo });
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
    const ejercicio = await Ejercicio.findByPk(Number(id));

    if (!ejercicio) {
      return res.status(404).json({ msg: `No se encontró el ejercicio con el id ${id}` });
    }

    await ejercicio.update({ nombre, tipo });
    return res.status(200).json({ msg: 'Ejercicio actualizado correctamente', ejercicio });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteEjercicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ejercicio = await Ejercicio.findByPk(Number(id));

    if (!ejercicio) {
      return res.status(404).json({ msg: `No se encontró el ejercicio con el id ${id}` });
    }

    await ejercicio.destroy();
    return res.status(200).json({ msg: 'Ejercicio eliminado correctamente' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getProgresoEjercicio = async (req, res, next) => {
  const { id } = req.params;
  try {
    const ejercicio = await Ejercicio.findByPk(Number(id));
    if (!ejercicio) {
      return res.status(404).json({ msg: `No se encontró el ejercicio con el id ${id}` });
    }

    const progreso = await EntrenamientoEjercicio.findAll({
      where: { ejercicio_id: id },
      attributes: ['series_realizadas', 'repeticiones_realizadas', 'peso_usado'],
      include: [
        {
          model: Entrenamiento,
          attributes: ['fecha', 'notas'],
        },
      ],
      order: [[Entrenamiento, 'fecha', 'DESC']],
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

module.exports = { getAllEjercicios, getEjercicioById, postNewEjercicio, updateEjercicio, deleteEjercicio, getProgresoEjercicio };
