import { sequelize } from '../config/database';
import { User } from './user.model';
import { Clinic } from './clinic.model';
import { Warehouse } from './warehouse.model';
import { Medicine } from './medicine.model';
import { Inventory } from './inventory.model';
import { SupplyRequest } from './supply-request.model';

// Registrar modelos
export { sequelize, User, Clinic, Warehouse, Medicine, Inventory, SupplyRequest };

// Configurar relaciones de forma explícita y fácil de leer

// Inventory pertenece a Warehouse y Medicine
Inventory.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
Inventory.belongsTo(Medicine, { foreignKey: 'medicineId' });
Warehouse.hasMany(Inventory, { foreignKey: 'warehouseId' });
Medicine.hasMany(Inventory, { foreignKey: 'medicineId' });

// SupplyRequest pertenece a Clinic, Medicine, Warehouse y User
SupplyRequest.belongsTo(Clinic, { foreignKey: 'clinicId' });
SupplyRequest.belongsTo(Medicine, { foreignKey: 'medicineId' });
SupplyRequest.belongsTo(Warehouse, { foreignKey: 'warehouseId' });
SupplyRequest.belongsTo(User, { foreignKey: 'requestedBy' });

Clinic.hasMany(SupplyRequest, { foreignKey: 'clinicId' });
Medicine.hasMany(SupplyRequest, { foreignKey: 'medicineId' });
Warehouse.hasMany(SupplyRequest, { foreignKey: 'warehouseId' });
User.hasMany(SupplyRequest, { foreignKey: 'requestedBy' });

export const initModels = async () => {
  // Relaciones ya configuradas arriba
};
