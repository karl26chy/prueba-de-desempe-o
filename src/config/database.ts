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
    // En desarrollo/test sync crea tablas faltantes automáticamente (útil para Docker sin migraciones manuales)
    // En producción la estructura se gestiona solo con migraciones como fuente de verdad
    if (env.nodeEnv !== 'production') {
      await sequelize.sync({ alter: false });
      console.log('✅ Sync modelos');
    } else {
      console.log('ℹ️ Sync omitido en producción (usar migraciones)');
    }
  } catch (error) {
    console.error('❌ Error conectando a DB:', error);
    throw error;
  }
};
