import { Request, Response, NextFunction } from 'express';
import { supplyRequestService } from '../services/supply-request.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class SupplyRequestController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const requestedBy = req.user?.id ?? null;
      const data = { ...req.body, requestedBy };
      const request = await supplyRequestService.createSupplyRequest(data);
      res.status(201).json(request);
    } catch (err) {
      next(err);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await supplyRequestService.getSupplyRequests();
      res.json(requests);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await supplyRequestService.getSupplyRequestById(req.params.id as string);
      res.json(request);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request = await supplyRequestService.updateSupplyRequest(req.params.id as string, req.body);
      res.json(request);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await supplyRequestService.deleteSupplyRequest(req.params.id as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const supplyRequestController = new SupplyRequestController();
