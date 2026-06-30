'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('rutinas', [
      {
        nombre: 'Full Body',
        descripcion: 'Rutina de cuerpo completo',
        duracion_minutos: 60,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Tren superior',
        descripcion: 'Rutina enfocada en pecho, hombros y brazos',
        duracion_minutos: 45,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Cardio',
        descripcion: 'Rutina cardiovascular',
        duracion_minutos: 30,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rutinas', null, {})
  }
}
