'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicines', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      // Nombre único evita duplicar medicamentos
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('medicines');
  },
};
