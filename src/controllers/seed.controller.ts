import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { seedService } from '../services/seed.service';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

export class SeedController {
  async import(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = (req as unknown as { file?: Express.Multer.File }).file;
      if (!file) {
        throw createHttpError('Archivo requerido', 400);
      }

      const result = await seedService.importSeed(file.buffer);

      res.status(201).json({
        message: 'Datos importados correctamente',
        counts: result.counts,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const seedController = new SeedController();
