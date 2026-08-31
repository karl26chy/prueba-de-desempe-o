import { inventoryRepository } from '../repositories/inventory.repository';
import { warehouseRepository } from '../repositories/warehouse.repository';
import { medicineRepository } from '../repositories/medicine.repository';
import { InventoryCreationAttributes } from '../models/inventory.model';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

function isUniqueError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'SequelizeUniqueConstraintError' || error.message.includes('unique') || error.message.includes('duplicate'))
  );
}

function isForeignKeyError(error: unknown): boolean {
  return error instanceof Error && (error.name === 'SequelizeForeignKeyConstraintError' || error.message.includes('violates foreign key'));
}

export class InventoryService {
  async createInventory(data: InventoryCreationAttributes) {
    const warehouse = await warehouseRepository.findById(data.warehouseId);
    if (!warehouse) {
      throw createHttpError('Almacén no encontrado', 404);
    }
    const medicine = await medicineRepository.findById(data.medicineId);
    if (!medicine) {
      throw createHttpError('Medicamento no encontrado', 404);
    }
    const exists = await inventoryRepository.findByWarehouseAndMedicine(data.warehouseId, data.medicineId);
    if (exists) {
      throw createHttpError('Inventario ya existe para este almacén y medicamento', 409);
    }
    try {
      const inventory = await inventoryRepository.create(data);
      return inventory.toJSON();
    } catch (error: unknown) {
      if (isUniqueError(error)) {
        throw createHttpError('Inventario ya existe para este almacén y medicamento', 409);
      }
      if (isForeignKeyError(error)) {
        throw createHttpError('Almacén o medicamento no encontrado', 404);
      }
      throw error;
    }
  }

  async getInventories() {
    const inventories = await inventoryRepository.findAll();
    return inventories.map((i) => i.toJSON());
  }

  async getInventoryById(id: string) {
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) {
      throw createHttpError('Inventario no encontrado', 404);
    }
    return inventory.toJSON();
  }

  async updateInventory(id: string, data: Partial<Pick<InventoryCreationAttributes, 'quantity'>>) {
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) {
      throw createHttpError('Inventario no encontrado', 404);
    }
    const updated = await inventoryRepository.update(id, data);
    if (!updated) {
      throw createHttpError('Inventario no encontrado', 404);
    }
    return updated.toJSON();
  }

  async deleteInventory(id: string) {
    const inventory = await inventoryRepository.findById(id);
    if (!inventory) {
      throw createHttpError('Inventario no encontrado', 404);
    }
    const ok = await inventoryRepository.delete(id);
    if (!ok) {
      throw createHttpError('Inventario no encontrado', 404);
    }
    return { message: 'Inventario eliminado' };
  }
}

export const inventoryService = new InventoryService();
