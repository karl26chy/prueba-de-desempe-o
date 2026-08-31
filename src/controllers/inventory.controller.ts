import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventory.service';

export class InventoryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await inventoryService.createInventory(req.body);
      res.status(201).json(inventory);
    } catch (err) {
      next(err);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const inventories = await inventoryService.getInventories();
      res.json(inventories);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await inventoryService.getInventoryById(req.params.id as string);
      res.json(inventory);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await inventoryService.updateInventory(req.params.id as string, req.body);
      res.json(inventory);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await inventoryService.deleteInventory(req.params.id as string);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const inventoryController = new InventoryController();
