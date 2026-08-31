import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Estados válidos: evita guardar estados que la aplicación no reconoce
export const SUPPLY_REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'DELIVERED'] as const;
export type SupplyRequestStatus = (typeof SUPPLY_REQUEST_STATUSES)[number];

export interface SupplyRequestAttributes {
  id: string;
  clinicId: string;
  medicineId: string;
  warehouseId: string | null;
  quantity: number;
  status: SupplyRequestStatus;
  requestedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupplyRequestCreationAttributes
  extends Optional<SupplyRequestAttributes, 'id' | 'warehouseId' | 'requestedBy' | 'status' | 'createdAt' | 'updatedAt'> {}

export class SupplyRequest extends Model<SupplyRequestAttributes, SupplyRequestCreationAttributes> implements SupplyRequestAttributes {
  declare id: string;
  declare clinicId: string;
  declare medicineId: string;
  declare warehouseId: string | null;
  declare quantity: number;
  declare status: SupplyRequestStatus;
  declare requestedBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SupplyRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clinicId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clinics',
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
    // Nullable porque el almacén puede no estar asignado inicialmente
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    // Cantidad debe ser mayor que cero
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PENDING',
      validate: {
        isIn: [SUPPLY_REQUEST_STATUSES as unknown as string[]],
      },
    },
    // Usuario solicitante, nullable compatible con flujo actual
    requestedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'supply_requests',
    modelName: 'SupplyRequest',
    timestamps: true,
    underscored: false,
  }
);
