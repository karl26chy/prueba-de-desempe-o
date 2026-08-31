import app from './app';
import { env } from './config/env';
import { connectDB } from './config/database';
import './models'; // asegura registro de modelos

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`🚀 Server corriendo en http://localhost:${env.port}`);
      console.log(`📚 Swagger en http://localhost:${env.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
