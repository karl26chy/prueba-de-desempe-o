import { User, UserRole } from '../models/user.model';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email, isActive: true } });
  }

  // Para validaciones internas permite buscar incluso inactivos
  async findByEmailAny(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user || !user.isActive) return null;
    return user;
  }

  async findAll(): Promise<User[]> {
    return User.findAll({ where: { isActive: true }, order: [['createdAt', 'DESC']] });
  }

  async create(data: { name: string; email: string; password: string; role?: UserRole }): Promise<User> {
    return User.create(data as any);
  }

  async update(id: string, data: Partial<{ name: string; email: string; role: UserRole }>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user || !user.isActive) return null;
    await user.update(data as any);
    return user;
  }

  // Eliminación lógica
  async delete(id: string): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user || !user.isActive) return false;
    await user.update({ isActive: false } as any);
    return true;
  }
}

export const userRepository = new UserRepository();
