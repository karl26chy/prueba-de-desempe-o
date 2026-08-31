import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClinicAttributes {
  id: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClinicCreationAttributes extends Optional<ClinicAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class Clinic extends Model<ClinicAttributes, ClinicCreationAttributes> implements ClinicAttributes {
  declare id: string;
  declare name: string;
  declare nit: string;
  declare address: string;
  declare phone: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Clinic.init(
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
    // NIT único evita duplicar clínicas con mismo identificador tributario
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Eliminación lógica: isActive false en lugar de borrar físicamente
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'clinics',
    modelName: 'Clinic',
    timestamps: true,
    underscored: false,
  }
);
