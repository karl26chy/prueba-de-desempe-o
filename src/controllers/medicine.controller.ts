import { Request, Response, NextFunction } from 'express';
import { medicineService } from '../services/medicine.service';

export class MedicineController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const medicine = await medicineService.createMedicine(req.body);
      res.status(201).json(medicine);
    } catch (err) {
      next(err);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const medicines = await medicineService.getMedicines();
      res.json(medicines);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const medicine = await medicineService.getMedicineById(req.params.id as string);
      res.json(medicine);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const medicine = await medicineService.updateMedicine(req.params.id as string, req.body);
      res.json(medicine);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await medicineService.deleteMedicine(req.params.id as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const medicineController = new MedicineController();
