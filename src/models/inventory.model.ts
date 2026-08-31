import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface InventoryAttributes {
  id: string;
  warehouseId: string;
  medicineId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  declare id: string;
  declare warehouseId: string;
  declare medicineId: string;
  declare quantity: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Inventory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Combinación única warehouseId + medicineId definida en migración para evitar duplicados
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    medicineId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'medicines',
        key: 'id',
      },
    },
    // Cantidad no puede ser negativa
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'inventories',
    modelName: 'Inventory',
    timestamps: true,
    underscored: false,
  }
);
