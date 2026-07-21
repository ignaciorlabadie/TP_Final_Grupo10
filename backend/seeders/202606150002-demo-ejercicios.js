'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ejercicios', [
      { nombre: 'Press de banca', tipo: 'fuerza', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Sentadilla', tipo: 'fuerza', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Peso muerto', tipo: 'fuerza', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Curl de bíceps', tipo: 'fuerza', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Remo con barra', tipo: 'fuerza', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Press militar', tipo: 'fuerza', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Correr en cinta', tipo: 'cardio', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Bicicleta fija', tipo: 'cardio', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Flexibilidad general', tipo: 'estiramiento', createdAt: new Date(), updatedAt: new Date() }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ejercicios', null, {})
  }
}
