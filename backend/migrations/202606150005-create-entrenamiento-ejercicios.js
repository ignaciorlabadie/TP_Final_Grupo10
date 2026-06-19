'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entrenamiento_ejercicios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      entrenamiento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'entrenamientos', key: 'id' },
        onDelete: 'CASCADE'
      },
      ejercicio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ejercicios', key: 'id' },
        onDelete: 'CASCADE'
      },
      series_realizadas: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      repeticiones_realizadas: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      peso_usado: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true
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
    await queryInterface.dropTable('entrenamiento_ejercicios')
  }
}
