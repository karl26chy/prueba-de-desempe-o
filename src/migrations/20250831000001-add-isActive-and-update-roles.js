'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar isActive no destructivo (idempotente si ya existe por reintento)
    const tableDesc = await queryInterface.describeTable('users');
    if (!tableDesc.isActive) {
      await queryInterface.addColumn('users', 'isActive', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    // 2. Cambiar role de ENUM('user','admin') a STRING para soportar ADMIN/GESTOR_SOLICITUDES
    //    En Postgres ENUM -> VARCHAR requiere USING role::text, changeColumn de Sequelize falla con default ENUM
    await queryInterface.sequelize.query('ALTER TABLE "users" ALTER COLUMN "role" TYPE VARCHAR USING "role"::text');
    await queryInterface.sequelize.query("ALTER TABLE \"users\" ALTER COLUMN \"role\" SET DEFAULT 'GESTOR_SOLICITUDES'");
    await queryInterface.sequelize.query('ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL');

    // 3. Convertir datos existentes de forma no destructiva
    await queryInterface.sequelize.query(`UPDATE "users" SET "role" = 'ADMIN' WHERE "role" = 'admin'`);
    await queryInterface.sequelize.query(`UPDATE "users" SET "role" = 'GESTOR_SOLICITUDES' WHERE "role" = 'user'`);
  },

  async down(queryInterface, Sequelize) {
    // Revertir conversión de datos primero (mientras sigue siendo STRING)
    await queryInterface.sequelize.query(`UPDATE "users" SET "role" = 'admin' WHERE "role" = 'ADMIN'`);
    await queryInterface.sequelize.query(`UPDATE "users" SET "role" = 'user' WHERE "role" = 'GESTOR_SOLICITUDES'`);

    // Revertir tipo de role a ENUM original (requiere recrear tipo si fue convertido a VARCHAR)
    await queryInterface.sequelize.query('ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT');
    // Eliminar default GESTOR antes de convertir a ENUM, luego setear nuevo tipo
    await queryInterface.sequelize.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "enum_users_role" USING "role"::"enum_users_role"`);
    await queryInterface.sequelize.query("ALTER TABLE \"users\" ALTER COLUMN \"role\" SET DEFAULT 'user'");

    // Eliminar isActive
    const tableDesc = await queryInterface.describeTable('users');
    if (tableDesc.isActive) {
      await queryInterface.removeColumn('users', 'isActive');
    }

    // Limpiar tipo ENUM huérfano si quedó uno nuevo (cuando STRING->ENUM crea enum_users_role)
    // El ENUM original es enum_users_role, no borrarlo aquí porque down ya lo recrea;
    // Si quisieramos limpieza completa: DROP TYPE IF EXISTS "enum_users_role" queda para el create-users down
  },
};
