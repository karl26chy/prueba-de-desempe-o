import { Clinic, ClinicCreationAttributes } from '../models/clinic.model';

export class ClinicRepository {
  async findAll(): Promise<Clinic[]> {
    return Clinic.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
  }

  async findById(id: string): Promise<Clinic | null> {
    const clinic = await Clinic.findByPk(id);
    if (!clinic || !clinic.isActive) return null;
    return clinic;
  }

  async findByNit(nit: string): Promise<Clinic | null> {
    return Clinic.findOne({ where: { nit } });
  }

  async create(data: ClinicCreationAttributes): Promise<Clinic> {
    return Clinic.create(data);
  }

  async update(id: string, data: Partial<ClinicCreationAttributes>): Promise<Clinic | null> {
    const clinic = await Clinic.findByPk(id);
    if (!clinic || !clinic.isActive) return null;
    await clinic.update(data);
    return clinic;
  }

  // Eliminación lógica: isActive false en lugar de borrar físicamente
  async deactivate(id: string): Promise<boolean> {
    const clinic = await Clinic.findByPk(id);
    if (!clinic || !clinic.isActive) return false;
    await clinic.update({ isActive: false });
    return true;
  }
}

export const clinicRepository = new ClinicRepository();
