'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      warehouseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'warehouses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      medicineId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'medicines', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Cantidad no puede ser negativa
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Evita que un mismo medicamento aparezca dos veces en el inventario del mismo almacén
    await queryInterface.addConstraint('inventories', {
      fields: ['warehouseId', 'medicineId'],
      type: 'unique',
      name: 'unique_warehouse_medicine',
    });

    // Restricción de cantidad no negativa
    await queryInterface.sequelize.query(
      'ALTER TABLE "inventories" ADD CONSTRAINT "check_quantity_non_negative" CHECK ("quantity" >= 0)'
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('inventories');
  },
};
