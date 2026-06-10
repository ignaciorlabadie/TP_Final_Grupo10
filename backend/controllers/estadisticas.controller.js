const { EntrenamientoModel } = require('../models/entrenamiento.model');
const { EntrenamientoEjercicioModel } = require('../models/entrenamiento_ejercicio.model');
const { EjercicioModel } = require('../models/ejercicio.model');
const { sequelize } = require('../models');

const { QueryTypes } = require('sequelize');

const getEstadisticas = async (req, res, next) => {
  try {
    const totalEntrenamientos = await EntrenamientoModel.count();

    const tiempoTotal = await EntrenamientoModel.sum('duracion_real');

    const promedioDuracion = await EntrenamientoModel.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('duracion_real')), 'promedio']],
      raw: true,
    });

    const ejercicioMasFrecuente = await EntrenamientoEjercicioModel.findAll({
      attributes: [
        'ejercicio_id',
        [sequelize.fn('COUNT', sequelize.col('ejercicio_id')), 'total'],
      ],
      include: [
        {
          model: EjercicioModel,
          attributes: ['nombre', 'tipo'],
        },
      ],
      group: ['ejercicio_id', 'EjercicioModel.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('ejercicio_id')), 'DESC']],
      limit: 1,
      raw: true,
      nest: true,
    });

    const entrenamientosPorMes = await sequelize.query(
      `SELECT
        TO_CHAR(fecha, 'YYYY-MM') AS mes,
        COUNT(*) AS total,
        COALESCE(SUM(duracion_real), 0) AS tiempo_total
      FROM entrenamientos
      GROUP BY TO_CHAR(fecha, 'YYYY-MM')
      ORDER BY mes DESC`,
      { type: QueryTypes.SELECT }
    );

    return res.status(200).json({
      total_entrenamientos: totalEntrenamientos,
      tiempo_total_minutos: tiempoTotal || 0,
      promedio_duracion_minutos: promedioDuracion?.promedio
        ? Math.round(Number(promedioDuracion.promedio))
        : 0,
      ejercicio_mas_frecuente: ejercicioMasFrecuente.length > 0 ? ejercicioMasFrecuente[0] : null,
      entrenamientos_por_mes: entrenamientosPorMes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getEstadisticas };
