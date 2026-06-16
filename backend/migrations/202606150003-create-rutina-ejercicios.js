'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rutina_ejercicios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      rutina_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rutinas', key: 'id' },
        onDelete: 'CASCADE'
      },
      ejercicio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ejercicios', key: 'id' },
        onDelete: 'CASCADE'
      },
      orden: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      series: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      repeticiones: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      descanso_segundos: {
        type: Sequelize.INTEGER,
        defaultValue: 60
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rutina_ejercicios')
  }
}
