import { userRepository } from '../repositories/user.repository';
import { UserRole } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: UserRole }) {
    const exists = await userRepository.findByEmail(data.email);
    if (exists) {
      const err: any = new Error('Email ya registrado');
      err.statusCode = 409;
      throw err;
    }
    const hashed = await hashPassword(data.password);
    const user = await userRepository.create({ ...data, password: hashed });

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { user: user.toJSON(), accessToken, refreshToken };
  }

  async login(data: { email: string; password: string }) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      const err: any = new Error('Credenciales inválidas');
      err.statusCode = 401;
      throw err;
    }
    const valid = await comparePassword(data.password, user.password);
    if (!valid) {
      const err: any = new Error('Credenciales inválidas');
      err.statusCode = 401;
      throw err;
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    return { user: user.toJSON(), accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      // Opcional: verificar que usuario aún existe
      const user = await userRepository.findById(payload.id);
      if (!user) {
        const err: any = new Error('Usuario no encontrado');
        err.statusCode = 401;
        throw err;
      }
      const newPayload = { id: user.id, email: user.email, role: user.role };
      const accessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (e: any) {
      if (e.statusCode) throw e;
      const err: any = new Error('Refresh token inválido');
      err.statusCode = 401;
      throw err;
    }
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err: any = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return user.toJSON();
  }
}

export const authService = new AuthService();
