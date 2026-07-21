const { EntrenamientoModel } = require('../models/entrenamiento.model');
const { EntrenamientoEjercicioModel } = require('../models/entrenamiento_ejercicio.model');
const { sequelize } = require('../models');

const { QueryTypes } = require('sequelize');

const getEstadisticas = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalEntrenamientos = await EntrenamientoModel.countEntrenamientos(userId);

    const tiempoTotal = await EntrenamientoModel.sum('duracion_real', { where: { user_id: userId } });

    const promedioDuracion = await EntrenamientoModel.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('duracion_real')), 'promedio']],
      where: { user_id: userId },
      raw: true,
    });

    const ejercicioMasFrecuente = await EntrenamientoEjercicioModel.findEjercicioMasFrecuente(userId);

    const entrenamientosPorMes = await sequelize.query(
      `SELECT
        TO_CHAR(fecha, 'YYYY-MM') AS mes,
        COUNT(*) AS total,
        COALESCE(SUM(duracion_real), 0) AS tiempo_total
      FROM entrenamientos
      WHERE user_id = :userId
      GROUP BY TO_CHAR(fecha, 'YYYY-MM')
      ORDER BY mes DESC`,
      { type: QueryTypes.SELECT, replacements: { userId } }
    );

    return res.status(200).json({
      total_entrenamientos: totalEntrenamientos,
      tiempo_total_minutos: tiempoTotal || 0,
      promedio_duracion_minutos: promedioDuracion?.promedio
        ? Math.round(Number(promedioDuracion.promedio))
        : 0,
      ejercicio_mas_frecuente: ejercicioMasFrecuente,
      entrenamientos_por_mes: entrenamientosPorMes,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getEstadisticas };
