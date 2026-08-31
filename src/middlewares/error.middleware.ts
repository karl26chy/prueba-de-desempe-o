import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export interface AppError extends Error {
  statusCode?: number;
  errors?: unknown;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Archivo demasiado grande (máximo 2 MB)' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Campo de archivo inesperado: use file' });
    }
    return res.status(400).json({ message: err.message || 'Error al subir archivo' });
  }

  // FileFilter errors from upload.middleware
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ message: err.message });
  }

  const status = err.statusCode || 500;

  // Validation errors with details (Zod)
  if (err.errors) {
    return res.status(status).json({
      message: err.message || 'Validation error',
      errors: err.errors,
    });
  }

  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
};
