import { warehouseRepository } from '../repositories/warehouse.repository';
import { WarehouseCreationAttributes } from '../models/warehouse.model';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

export class WarehouseService {
  async createWarehouse(data: WarehouseCreationAttributes) {
    const warehouse = await warehouseRepository.create(data);
    return warehouse.toJSON();
  }

  async getWarehouses() {
    const warehouses = await warehouseRepository.findAll();
    return warehouses.map((w) => w.toJSON());
  }

  async getWarehouseById(id: string) {
    const warehouse = await warehouseRepository.findById(id);
    if (!warehouse) {
      throw createHttpError('Almacén no encontrado', 404);
    }
    return warehouse.toJSON();
  }

  async updateWarehouse(id: string, data: Partial<WarehouseCreationAttributes>) {
    const warehouse = await warehouseRepository.findById(id);
    if (!warehouse) {
      throw createHttpError('Almacén no encontrado', 404);
    }
    const updated = await warehouseRepository.update(id, data);
    if (!updated) {
      throw createHttpError('Almacén no encontrado', 404);
    }
    return updated.toJSON();
  }

  async deleteWarehouse(id: string) {
    const ok = await warehouseRepository.deactivate(id);
    if (!ok) {
      throw createHttpError('Almacén no encontrado', 404);
    }
    return { message: 'Almacén desactivado' };
  }
}

export const warehouseService = new WarehouseService();
