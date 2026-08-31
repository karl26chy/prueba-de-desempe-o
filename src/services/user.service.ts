import { userRepository } from '../repositories/user.repository';
import { UserRole } from '../models/user.model';

export class UserService {
  async getAll() {
    const users = await userRepository.findAll();
    return users.map((u) => u.toJSON());
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err: any = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return user.toJSON();
  }

  async update(id: string, data: Partial<{ name: string; email: string; role: UserRole }>) {
    const user = await userRepository.update(id, data);
    if (!user) {
      const err: any = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return user.toJSON();
  }

  async delete(id: string) {
    const ok = await userRepository.delete(id);
    if (!ok) {
      const err: any = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return { message: 'Usuario eliminado' };
  }
}

export const userService = new UserService();
