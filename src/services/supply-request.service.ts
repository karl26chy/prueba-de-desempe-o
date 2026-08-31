import { supplyRequestRepository } from '../repositories/supply-request.repository';
import { clinicRepository } from '../repositories/clinic.repository';
import { medicineRepository } from '../repositories/medicine.repository';
import { warehouseRepository } from '../repositories/warehouse.repository';
import { inventoryRepository } from '../repositories/inventory.repository';
import { SupplyRequestCreationAttributes, SupplyRequestStatus } from '../models/supply-request.model';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

function isForeignKeyError(error: unknown): boolean {
  return error instanceof Error && (error.name === 'SequelizeForeignKeyConstraintError' || error.message.includes('violates foreign key'));
}

export class SupplyRequestService {
  async createSupplyRequest(data: Omit<SupplyRequestCreationAttributes, 'requestedBy'> & { requestedBy?: string | null }) {
    const clinic = await clinicRepository.findById(data.clinicId);
    if (!clinic) {
      throw createHttpError('Clínica no encontrada', 404);
    }
    const medicine = await medicineRepository.findById(data.medicineId);
    if (!medicine) {
      throw createHttpError('Medicamento no encontrado', 404);
    }
    if (data.warehouseId) {
      const warehouse = await warehouseRepository.findById(data.warehouseId);
      if (!warehouse) {
        throw createHttpError('Almacén no encontrado', 404);
      }
      // Verificar inventario suficiente para la combinación warehouse + medicine
      const inventory = await inventoryRepository.findByWarehouseAndMedicine(data.warehouseId, data.medicineId);
      if (!inventory || inventory.quantity < data.quantity) {
        throw createHttpError('Inventario insuficiente', 409);
      }
    }
    try {
      const request = await supplyRequestRepository.create(data as SupplyRequestCreationAttributes);
      return request.toJSON();
    } catch (error: unknown) {
      if (isForeignKeyError(error)) {
        throw createHttpError('Clínica, medicamento o almacén no encontrado', 404);
      }
      throw error;
    }
  }

  async getSupplyRequests() {
    const requests = await supplyRequestRepository.findAll();
    return requests.map((r) => r.toJSON());
  }

  async getActiveRequests() {
    const requests = await supplyRequestRepository.findActive();
    return requests.map((r) => r.toJSON());
  }

  async getHistory() {
    const requests = await supplyRequestRepository.findHistory();
    return requests.map((r) => r.toJSON());
  }

  async getHistoryByClinicId(clinicId: string) {
    const clinic = await clinicRepository.findById(clinicId);
    if (!clinic) {
      throw createHttpError('Clínica no encontrada', 404);
    }
    const requests = await supplyRequestRepository.findHistoryByClinicId(clinicId);
    return requests.map((r) => r.toJSON());
  }

  async getSupplyRequestById(id: string) {
    const request = await supplyRequestRepository.findById(id);
    if (!request) {
      throw createHttpError('Solicitud no encontrada', 404);
    }
    return request.toJSON();
  }

  async updateSupplyRequest(id: string, data: Partial<Pick<SupplyRequestCreationAttributes, 'status' | 'warehouseId' | 'quantity'>>) {
    const request = await supplyRequestRepository.findById(id);
    if (!request) {
      throw createHttpError('Solicitud no encontrada', 404);
    }
    if (data.warehouseId !== undefined) {
      if (data.warehouseId) {
        const warehouse = await warehouseRepository.findById(data.warehouseId);
        if (!warehouse) {
          throw createHttpError('Almacén no encontrado', 404);
        }
      }
    }
    try {
      const updated = await supplyRequestRepository.update(id, data as Partial<SupplyRequestCreationAttributes>);
      if (!updated) {
        throw createHttpError('Solicitud no encontrada', 404);
      }
      return updated.toJSON();
    } catch (error: unknown) {
      if (isForeignKeyError(error)) {
        throw createHttpError('Almacén no encontrado', 404);
      }
      throw error;
    }
  }

  async deleteSupplyRequest(id: string) {
    const request = await supplyRequestRepository.findById(id);
    if (!request) {
      throw createHttpError('Solicitud no encontrada', 404);
    }
    // Eliminación lógica mediante estado REJECTED, conserva el registro
    const updated = await supplyRequestRepository.update(id, { status: 'REJECTED' as SupplyRequestStatus });
    if (!updated) {
      throw createHttpError('Solicitud no encontrada', 404);
    }
    return { message: 'Solicitud de suministro eliminada' };
  }
}

export const supplyRequestService = new SupplyRequestService();
