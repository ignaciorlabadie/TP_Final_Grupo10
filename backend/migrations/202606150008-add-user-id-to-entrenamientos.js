'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('entrenamientos', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('entrenamientos', 'user_id')
  }
}
