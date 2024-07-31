import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import { env } from './utils/env.js';

dotenv.config();

const PORT = Number(env('PORT', '3000'));

// const PORT = Number(process.env.PORT) || 3000;

export function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // eslint-disable-next-line no-unused-vars
  app.use('*', (req, res, next) => {
    res.status(404).send({ status: 404, message: 'Route not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal Server Error' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
