import { Medicine, MedicineCreationAttributes } from '../models/medicine.model';

export class MedicineRepository {
  async findAll(): Promise<Medicine[]> {
    return Medicine.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
  }

  async findById(id: string): Promise<Medicine | null> {
    const medicine = await Medicine.findByPk(id);
    if (!medicine || !medicine.isActive) return null;
    return medicine;
  }

  // Permite detectar duplicados incluso si el medicamento está inactivo (name es UNIQUE)
  async findByName(name: string): Promise<Medicine | null> {
    return Medicine.findOne({ where: { name } });
  }

  async create(data: MedicineCreationAttributes): Promise<Medicine> {
    return Medicine.create(data);
  }

  async update(id: string, data: Partial<MedicineCreationAttributes>): Promise<Medicine | null> {
    const medicine = await Medicine.findByPk(id);
    if (!medicine || !medicine.isActive) return null;
    await medicine.update(data);
    return medicine;
  }

  // Eliminación lógica para conservar el registro en la base de datos
  async deactivate(id: string): Promise<boolean> {
    const medicine = await Medicine.findByPk(id);
    if (!medicine || !medicine.isActive) return false;
    await medicine.update({ isActive: false });
    return true;
  }
}

export const medicineRepository = new MedicineRepository();
