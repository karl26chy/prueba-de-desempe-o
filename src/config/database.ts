import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'postgres',
  logging: env.nodeEnv === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado vía Sequelize');
    // Sync asegura creación de tablas si no existen (útil para Docker sin migraciones manuales)
    // En prod ideal usar migraciones: npx sequelize-cli db:migrate
    await sequelize.sync({ alter: false });
    console.log('✅ Sync modelos');
  } catch (error) {
    console.error('❌ Error conectando a DB:', error);
    throw error;
  }
};
