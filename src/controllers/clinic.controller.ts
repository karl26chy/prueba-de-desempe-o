import { Request, Response, NextFunction } from 'express';
import { clinicService } from '../services/clinic.service';

export class ClinicController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await clinicService.createClinic(req.body);
      res.status(201).json(clinic);
    } catch (err) {
      next(err);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const clinics = await clinicService.getClinics();
      res.json(clinics);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await clinicService.getClinicById(req.params.id as string);
      res.json(clinic);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const clinic = await clinicService.updateClinic(req.params.id as string, req.body);
      res.json(clinic);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await clinicService.deleteClinic(req.params.id as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const clinicController = new ClinicController();
