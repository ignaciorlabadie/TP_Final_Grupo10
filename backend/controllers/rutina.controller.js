const { RutinaModel } = require('../models/rutina.model');
const { RutinaEjercicioModel } = require('../models/rutina_ejercicio.model');
const { EjercicioModel } = require('../models/ejercicio.model');
const { EntrenamientoModel } = require('../models/entrenamiento.model');

const getAllRutinas = async (req, res, next) => {
  try {
    // findAllRutinas() trae los ejercicios asociados a cada rutina, por el include que agregué en el modelo
    const rutinas = await RutinaModel.findAllRutinas();
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
    const rutina = await RutinaModel.findById(Number(id));
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

    const idsEjercicios = ejercicios.map(ej => ej.ejercicio_id);
    const ejerciciosExistentes = await EjercicioModel.findAll({
      where: { id: idsEjercicios }
    });
    if (ejerciciosExistentes.length !== idsEjercicios.length) {
      const idsExistentes = ejerciciosExistentes.map(e => e.id);
      const idsInvalidos = idsEjercicios.filter(id => !idsExistentes.includes(id));
      return res.status(400).json({
        errors: [`Los siguientes ejercicio_id no existen: ${idsInvalidos.join(', ')}`]
      });
    }

    const nuevaRutina = await RutinaModel.createRutina({ nombre, descripcion, duracion_minutos });

    const ejerciciosData = ejercicios.map((ej, index) => ({
      rutina_id: nuevaRutina.id,
      ejercicio_id: ej.ejercicio_id,
      orden: ej.orden ?? index + 1,
      series: ej.series ?? 1,
      repeticiones: ej.repeticiones ?? 1,
      descanso_segundos: ej.descanso_segundos ?? 60,
    }));
    await RutinaEjercicioModel.bulkCreate(ejerciciosData);

    const rutinaCompleta = await RutinaModel.findById(nuevaRutina.id);
    return res.status(201).json({ msg: 'Rutina creada correctamente', rutina: rutinaCompleta });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateRutina = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion_minutos, ejercicios } = req.body;

    const rutina = await RutinaModel.updateRutina(Number(id), { nombre, descripcion, duracion_minutos });
    if (!rutina) {
      return res.status(404).json({ msg: `No se encontró la rutina con el id ${id}` });
    }

    if (ejercicios) {
      const idsEjercicios = ejercicios.map(ej => ej.ejercicio_id);
      const ejerciciosExistentes = await EjercicioModel.findAll({
        where: { id: idsEjercicios }
      });
      if (ejerciciosExistentes.length !== idsEjercicios.length) {
        const idsExistentes = ejerciciosExistentes.map(e => e.id);
        const idsInvalidos = idsEjercicios.filter(id => !idsExistentes.includes(id));
        return res.status(400).json({
          errors: [`Los siguientes ejercicio_id no existen: ${idsInvalidos.join(', ')}`]
        });
      }

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

    const rutinaActualizada = await RutinaModel.findById(Number(id));
    return res.status(200).json({ msg: 'Rutina actualizada correctamente', rutina: rutinaActualizada });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteRutina = async (req, res, next) => {
  try {
    const { id } = req.params;

    const entrenamientos = await EntrenamientoModel.count({
      where: { rutina_id: id }
    });
    if (entrenamientos > 0) {
      return res.status(400).json({
        errors: ['No se puede eliminar la rutina porque tiene entrenamientos asociados']
      });
    }

    await RutinaEjercicioModel.destroy({ where: { rutina_id: id } });
    const deleted = await RutinaModel.deleteRutina(Number(id));

    if (!deleted) {
      return res.status(404).json({ msg: `No se encontró la rutina con el id ${id}` });
    }
    
    return res.status(200).json({ msg: 'Rutina eliminada correctamente' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getAllRutinas, getRutinaById, postNewRutina, updateRutina, deleteRutina };
