import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const ALLOWED_MIMES = ['application/json', 'text/json'];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIMES.includes(file.mimetype);

  if (ext !== '.json' || !mimeOk) {
    const err = new Error('Tipo de archivo no permitido: solo .json application/json') as Error & { statusCode?: number };
    err.statusCode = 400;
    return cb(err);
  }

  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});
