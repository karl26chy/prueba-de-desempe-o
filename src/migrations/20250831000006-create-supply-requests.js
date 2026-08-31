'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('supply_requests', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
      clinicId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'clinics', key: 'id' },
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
      // Nullable porque el almacén puede no estar asignado inicialmente
      warehouseId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'warehouses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // Cantidad debe ser mayor que cero
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      // Estados válidos: evita guardar estados que la aplicación no reconoce
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'PENDING',
      },
      requestedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Restricción cantidad > 0
    await queryInterface.sequelize.query(
      'ALTER TABLE "supply_requests" ADD CONSTRAINT "check_quantity_positive" CHECK ("quantity" > 0)'
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('supply_requests');
  },
};
