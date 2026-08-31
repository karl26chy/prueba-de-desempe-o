import { userRepository } from '../repositories/user.repository';
import { UserRole } from '../models/user.model';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

export class UserService {
  async getAll() {
    const users = await userRepository.findAll();
    return users.map((u) => u.toJSON());
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw createHttpError('Usuario no encontrado', 404);
    }
    return user.toJSON();
  }

  async update(id: string, data: Partial<{ name: string; email: string; role: UserRole }>) {
    const user = await userRepository.update(id, data);
    if (!user) {
      throw createHttpError('Usuario no encontrado', 404);
    }
    return user.toJSON();
  }

  async delete(id: string) {
    const ok = await userRepository.delete(id);
    if (!ok) {
      throw createHttpError('Usuario no encontrado', 404);
    }
    return { message: 'Usuario desactivado' };
  }
}

export const userService = new UserService();
