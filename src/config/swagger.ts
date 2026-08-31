import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Backend - Arquitectura por Capas',
      version: '1.0.0',
      description: 'Backend Node.js + Express + Sequelize + PostgreSQL + JWT + Zod',
    },
    servers: [
      {
        url: env.apiUrl,
        description: 'Servidor desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './dist/routes/*.js', './dist/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
