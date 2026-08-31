import { clinicRepository } from '../repositories/clinic.repository';
import { ClinicCreationAttributes } from '../models/clinic.model';

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

export class ClinicService {
  async createClinic(data: ClinicCreationAttributes) {
    const exists = await clinicRepository.findByNit(data.nit);
    if (exists) {
      throw createHttpError('NIT ya registrado', 409);
    }
    try {
      const clinic = await clinicRepository.create(data);
      return clinic.toJSON();
    } catch (error: unknown) {
      if (isUniqueError(error)) {
        throw createHttpError('NIT ya registrado', 409);
      }
      throw error;
    }
  }

  async getClinics() {
    const clinics = await clinicRepository.findAll();
    return clinics.map((c) => c.toJSON());
  }

  async getClinicById(id: string) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) {
      throw createHttpError('Clínica no encontrada', 404);
    }
    return clinic.toJSON();
  }

  async updateClinic(id: string, data: Partial<ClinicCreationAttributes>) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) {
      throw createHttpError('Clínica no encontrada', 404);
    }
    if (data.nit && data.nit !== clinic.nit) {
      const exists = await clinicRepository.findByNit(data.nit);
      if (exists) {
        throw createHttpError('NIT ya registrado', 409);
      }
    }
    try {
      const updated = await clinicRepository.update(id, data);
      if (!updated) {
        throw createHttpError('Clínica no encontrada', 404);
      }
      return updated.toJSON();
    } catch (error: unknown) {
      if (isUniqueError(error)) {
        throw createHttpError('NIT ya registrado', 409);
      }
      throw error;
    }
  }

  async deleteClinic(id: string) {
    const ok = await clinicRepository.deactivate(id);
    if (!ok) {
      throw createHttpError('Clínica no encontrada', 404);
    }
    return { message: 'Clínica desactivada' };
  }
}

export const clinicService = new ClinicService();
