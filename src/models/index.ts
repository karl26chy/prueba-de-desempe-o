import { sequelize } from '../config/database';
import { User } from './user.model';

// Registrar modelos aquí para associations futuras

export { sequelize, User };

export const initModels = async () => {
  // Relaciones futuras: User.hasMany(Order) etc.
};
