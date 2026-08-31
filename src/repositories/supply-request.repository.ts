import { SupplyRequest, SupplyRequestCreationAttributes } from '../models/supply-request.model';

export class SupplyRequestRepository {
  async findAll(): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id: string): Promise<SupplyRequest | null> {
    return SupplyRequest.findByPk(id);
  }

  async create(data: SupplyRequestCreationAttributes): Promise<SupplyRequest> {
    return SupplyRequest.create(data);
  }

  async update(id: string, data: Partial<SupplyRequestCreationAttributes>): Promise<SupplyRequest | null> {
    const request = await SupplyRequest.findByPk(id);
    if (!request) return null;
    await request.update(data);
    return request;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await SupplyRequest.destroy({ where: { id } });
    return deleted > 0;
  }
}

export const supplyRequestRepository = new SupplyRequestRepository();
