import { Request, Response, NextFunction } from 'express';
import { warehouseService } from '../services/warehouse.service';

export class WarehouseController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await warehouseService.createWarehouse(req.body);
      res.status(201).json(warehouse);
    } catch (err) {
      next(err);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = await warehouseService.getWarehouses();
      res.json(warehouses);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await warehouseService.getWarehouseById(req.params.id as string);
      res.json(warehouse);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await warehouseService.updateWarehouse(req.params.id as string, req.body);
      res.json(warehouse);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await warehouseService.deleteWarehouse(req.params.id as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const warehouseController = new WarehouseController();
