'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = await bcrypt.hash('123456', 10)
    await queryInterface.bulkInsert('users', [
      {
        nombre: 'Admin',
        email: 'admin@mail.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Usuario Demo',
        email: 'demo@mail.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  }
}
