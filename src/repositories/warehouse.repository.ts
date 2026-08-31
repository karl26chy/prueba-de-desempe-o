import { Warehouse, WarehouseCreationAttributes } from '../models/warehouse.model';

export class WarehouseRepository {
  async findAll(): Promise<Warehouse[]> {
    return Warehouse.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
  }

  async findById(id: string): Promise<Warehouse | null> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse || !warehouse.isActive) return null;
    return warehouse;
  }

  async create(data: WarehouseCreationAttributes): Promise<Warehouse> {
    return Warehouse.create(data);
  }

  async update(id: string, data: Partial<WarehouseCreationAttributes>): Promise<Warehouse | null> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse || !warehouse.isActive) return null;
    await warehouse.update(data);
    return warehouse;
  }

  // Eliminación lógica: isActive false en lugar de borrar físicamente
  async deactivate(id: string): Promise<boolean> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse || !warehouse.isActive) return false;
    await warehouse.update({ isActive: false });
    return true;
  }
}

export const warehouseRepository = new WarehouseRepository();
