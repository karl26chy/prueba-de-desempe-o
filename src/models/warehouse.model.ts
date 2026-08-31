import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface WarehouseAttributes {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  declare id: string;
  declare name: string;
  declare location: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Eliminación lógica
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'warehouses',
    modelName: 'Warehouse',
    timestamps: true,
    underscored: false,
  }
);
