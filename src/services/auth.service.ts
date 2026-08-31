import { userRepository } from '../repositories/user.repository';
import { UserRole } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

function createHttpError(message: string, statusCode: number): Error & { statusCode: number } {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
}

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: UserRole }) {
    const existsAny = await userRepository.findByEmailAny(data.email);
    if (existsAny) {
      throw createHttpError('Email ya registrado', 409);
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
      throw createHttpError('Credenciales inválidas', 401);
    }
    const valid = await comparePassword(data.password, user.password);
    if (!valid) {
      throw createHttpError('Credenciales inválidas', 401);
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    return { user: user.toJSON(), accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(payload.id);
      if (!user) {
        throw createHttpError('Usuario no encontrado', 401);
      }
      const newPayload = { id: user.id, email: user.email, role: user.role };
      const accessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (e: any) {
      if (e instanceof Error && 'statusCode' in e) throw e;
      throw createHttpError('Refresh token inválido', 401);
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
