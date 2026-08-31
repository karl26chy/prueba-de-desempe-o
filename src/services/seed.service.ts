import { Op, Transaction } from 'sequelize';
import { sequelize, User, Clinic, Warehouse, Medicine } from '../models';
import { UserCreationAttributes } from '../models/user.model';
import { ClinicCreationAttributes } from '../models/clinic.model';
import { WarehouseCreationAttributes } from '../models/warehouse.model';
import { MedicineCreationAttributes } from '../models/medicine.model';
import { seedFileSchema, SeedFileInput } from '../validators/seed.validator';
import { hashPassword } from '../utils/password';
import { ZodError } from 'zod';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

function isUniqueError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === 'SequelizeUniqueConstraintError' ||
      error.message.includes('unique') ||
      error.message.includes('duplicate') ||
      error.message.includes('Unique'))
  );
}

function findDuplicates(values: string[]): string | null {
  const seen = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) return v;
    seen.add(v);
  }
  return null;
}

export class SeedService {
  async importSeed(buffer: Buffer): Promise<{ counts: { users: number; clinics: number; warehouses: number; medicines: number } }> {
    // 1. Buffer -> UTF-8
    let text: string;
    try {
      text = buffer.toString('utf-8');
    } catch {
      throw createHttpError('Archivo inválido', 400);
    }

    // 2. JSON.parse
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw createHttpError('JSON malformado', 400);
    }

    // 3. Validar con Zod
    let data: SeedFileInput;
    try {
      data = seedFileSchema.parse(parsed);
    } catch (error) {
      if (error instanceof ZodError) {
        const err = createHttpError('Validation error', 400) as Error & { statusCode: number; errors?: unknown };
        (err as unknown as { errors: unknown }).errors = error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw err;
      }
      throw error;
    }

    const users = data.users ?? [];
    const clinics = data.clinics ?? [];
    const warehouses = data.warehouses ?? [];
    const medicines = data.medicines ?? [];

    // 4. Detectar duplicados intra-JSON (fail-fast antes de transacción)
    if (users.length > 0) {
      const dup = findDuplicates(users.map((u) => u.email.toLowerCase()));
      if (dup) throw createHttpError(`Email duplicado en JSON: ${dup}`, 409);
    }
    if (clinics.length > 0) {
      const dup = findDuplicates(clinics.map((c) => c.nit));
      if (dup) throw createHttpError(`NIT duplicado en JSON: ${dup}`, 409);
    }
    if (medicines.length > 0) {
      const dup = findDuplicates(medicines.map((m) => m.name.toLowerCase()));
      if (dup) throw createHttpError(`Medicamento duplicado en JSON: ${dup}`, 409);
    }

    // 5. Hash passwords
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await hashPassword(u.password),
      }))
    );

    // 6. Transacción única
    try {
      const counts = await sequelize.transaction(async (t: Transaction) => {
        // 6a. Comprobar conflictos existentes dentro de la transacción
        if (hashedUsers.length > 0) {
          const emails = hashedUsers.map((u) => u.email);
          // comparación case-insensitive: usar lower en JS y ILIKE no necesario si email UNIQUE es case-sensitive en PG;
          // buscamos exacto + lower
          const existing = await User.findAll({
            where: { email: { [Op.in]: emails } },
            transaction: t,
            attributes: ['email'],
          });
          if (existing.length > 0) {
            throw createHttpError(`Email ya registrado: ${existing[0].email}`, 409);
          }
          // también verificar duplicados case-insensitive lower
          const lowerEmails = emails.map((e) => e.toLowerCase());
          const lowerExisting = await User.findAll({
            where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), { [Op.in]: lowerEmails }),
            transaction: t,
            attributes: ['email'],
          });
          // El check anterior ya cubre exacto; este cubre variaciones de mayúsculas si el primero no las capturó
          if (lowerExisting.length > 0 && existing.length === 0) {
            throw createHttpError(`Email ya registrado: ${lowerExisting[0].email}`, 409);
          }
        }

        if (clinics.length > 0) {
          const nits = clinics.map((c) => c.nit);
          const existing = await Clinic.findAll({
            where: { nit: { [Op.in]: nits } },
            transaction: t,
            attributes: ['nit'],
          });
          if (existing.length > 0) {
            throw createHttpError(`NIT ya registrado: ${existing[0].nit}`, 409);
          }
        }

        if (medicines.length > 0) {
          const names = medicines.map((m) => m.name);
          const lowerNames = names.map((n) => n.toLowerCase());
          const existing = await Medicine.findAll({
            where: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), { [Op.in]: lowerNames }),
            transaction: t,
            attributes: ['name'],
          });
          if (existing.length > 0) {
            throw createHttpError(`Medicamento ya registrado: ${existing[0].name}`, 409);
          }
        }

        // 6b. Inserts con transaction
        let createdUsers = 0;
        let createdClinics = 0;
        let createdWarehouses = 0;
        let createdMedicines = 0;

        if (hashedUsers.length > 0) {
          const result = await User.bulkCreate(hashedUsers as unknown as UserCreationAttributes[], {
            transaction: t,
            validate: true,
          });
          createdUsers = result.length;
        }

        if (clinics.length > 0) {
          const result = await Clinic.bulkCreate(clinics as unknown as ClinicCreationAttributes[], {
            transaction: t,
            validate: true,
          });
          createdClinics = result.length;
        }

        if (warehouses.length > 0) {
          const result = await Warehouse.bulkCreate(warehouses as unknown as WarehouseCreationAttributes[], {
            transaction: t,
            validate: true,
          });
          createdWarehouses = result.length;
        }

        if (medicines.length > 0) {
          const result = await Medicine.bulkCreate(medicines as unknown as MedicineCreationAttributes[], {
            transaction: t,
            validate: true,
          });
          createdMedicines = result.length;
        }

        return {
          users: createdUsers,
          clinics: createdClinics,
          warehouses: createdWarehouses,
          medicines: createdMedicines,
        };
      });

      return { counts };
    } catch (error: unknown) {
      if (error instanceof Error && 'statusCode' in error) throw error;
      if (isUniqueError(error)) {
        const msg = error instanceof Error ? error.message : 'Duplicado detectado';
        // Extraer campo si es posible
        if (msg.toLowerCase().includes('email')) throw createHttpError('Email ya registrado', 409);
        if (msg.toLowerCase().includes('nit')) throw createHttpError('NIT ya registrado', 409);
        if (msg.toLowerCase().includes('name')) throw createHttpError('Medicamento ya registrado', 409);
        throw createHttpError('Duplicado detectado', 409);
      }
      throw error;
    }
  }
}

export const seedService = new SeedService();
