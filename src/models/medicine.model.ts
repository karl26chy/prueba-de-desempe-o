import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface MedicineAttributes {
  id: string;
  name: string;
  description: string;
  unit: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MedicineCreationAttributes extends Optional<MedicineAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'> {}

export class Medicine extends Model<MedicineAttributes, MedicineCreationAttributes> implements MedicineAttributes {
  declare id: string;
  declare name: string;
  declare description: string;
  declare unit: string;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Medicine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Nombre único evita duplicar medicamentos
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
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
    tableName: 'medicines',
    modelName: 'Medicine',
    timestamps: true,
    underscored: false,
  }
);
