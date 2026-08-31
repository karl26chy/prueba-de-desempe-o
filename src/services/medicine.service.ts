import { medicineRepository } from '../repositories/medicine.repository';
import { MedicineCreationAttributes } from '../models/medicine.model';

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

export class MedicineService {
  async createMedicine(data: MedicineCreationAttributes) {
    const exists = await medicineRepository.findByName(data.name);
    if (exists) {
      throw createHttpError('Medicamento ya registrado', 409);
    }
    try {
      const medicine = await medicineRepository.create(data);
      return medicine.toJSON();
    } catch (error: unknown) {
      if (isUniqueError(error)) {
        throw createHttpError('Medicamento ya registrado', 409);
      }
      throw error;
    }
  }

  async getMedicines() {
    const medicines = await medicineRepository.findAll();
    return medicines.map((m) => m.toJSON());
  }

  async getMedicineById(id: string) {
    const medicine = await medicineRepository.findById(id);
    if (!medicine) {
      throw createHttpError('Medicamento no encontrado', 404);
    }
    return medicine.toJSON();
  }

  async updateMedicine(id: string, data: Partial<MedicineCreationAttributes>) {
    const medicine = await medicineRepository.findById(id);
    if (!medicine) {
      throw createHttpError('Medicamento no encontrado', 404);
    }
    if (data.name && data.name !== medicine.name) {
      const exists = await medicineRepository.findByName(data.name);
      if (exists) {
        throw createHttpError('Medicamento ya registrado', 409);
      }
    }
    try {
      const updated = await medicineRepository.update(id, data);
      if (!updated) {
        throw createHttpError('Medicamento no encontrado', 404);
      }
      return updated.toJSON();
    } catch (error: unknown) {
      if (isUniqueError(error)) {
        throw createHttpError('Medicamento ya registrado', 409);
      }
      throw error;
    }
  }

  async deleteMedicine(id: string) {
    const ok = await medicineRepository.deactivate(id);
    if (!ok) {
      throw createHttpError('Medicamento no encontrado', 404);
    }
    return { message: 'Medicamento desactivado' };
  }
}

export const medicineService = new MedicineService();
