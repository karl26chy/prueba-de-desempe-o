import { Inventory, InventoryCreationAttributes } from '../models/inventory.model';

export class InventoryRepository {
  async findAll(): Promise<Inventory[]> {
    return Inventory.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id: string): Promise<Inventory | null> {
    return Inventory.findByPk(id);
  }

  // Combinación warehouseId + medicineId es UNIQUE en la base de datos
  async findByWarehouseAndMedicine(warehouseId: string, medicineId: string): Promise<Inventory | null> {
    return Inventory.findOne({ where: { warehouseId, medicineId } });
  }

  async create(data: InventoryCreationAttributes): Promise<Inventory> {
    return Inventory.create(data);
  }

  async update(id: string, data: Partial<Pick<InventoryCreationAttributes, 'quantity'>>): Promise<Inventory | null> {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) return null;
    await inventory.update(data);
    return inventory;
  }

  // Eliminación física porque Inventory no tiene isActive
  async delete(id: string): Promise<boolean> {
    const deleted = await Inventory.destroy({ where: { id } });
    return deleted > 0;
  }
}

export const inventoryRepository = new InventoryRepository();
