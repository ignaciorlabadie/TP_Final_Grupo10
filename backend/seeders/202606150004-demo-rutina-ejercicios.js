'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('rutina_ejercicios', [
      { rutina_id: 1, ejercicio_id: 1, orden: 1, series: 4, repeticiones: 10, descanso_segundos: 60, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 1, ejercicio_id: 2, orden: 2, series: 4, repeticiones: 12, descanso_segundos: 90, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 1, ejercicio_id: 5, orden: 3, series: 3, repeticiones: 10, descanso_segundos: 60, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 2, ejercicio_id: 1, orden: 1, series: 4, repeticiones: 10, descanso_segundos: 60, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 2, ejercicio_id: 4, orden: 2, series: 3, repeticiones: 12, descanso_segundos: 45, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 2, ejercicio_id: 6, orden: 3, series: 4, repeticiones: 8, descanso_segundos: 60, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 3, ejercicio_id: 7, orden: 1, series: 1, repeticiones: 1, descanso_segundos: 0, createdAt: new Date(), updatedAt: new Date() },
      { rutina_id: 3, ejercicio_id: 8, orden: 2, series: 1, repeticiones: 1, descanso_segundos: 0, createdAt: new Date(), updatedAt: new Date() }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rutina_ejercicios', null, {})
  }
}
