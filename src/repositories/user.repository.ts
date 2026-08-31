import { User } from '../models/user.model';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async findAll(): Promise<User[]> {
    return User.findAll({ order: [['createdAt', 'DESC']] });
  }

  async create(data: { name: string; email: string; password: string; role?: 'user' | 'admin' }): Promise<User> {
    return User.create(data);
  }

  async update(id: string, data: Partial<{ name: string; email: string; role: 'user' | 'admin' }>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data as any);
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }
}

export const userRepository = new UserRepository();
