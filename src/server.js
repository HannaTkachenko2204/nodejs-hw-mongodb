import express from 'express'; // JavaScript бібліотека, яка призначена для розробки вебдодатків і API. Express побудований на базі Node.js
import pino from 'pino-http'; // логування дозволяє слідкувати за тим, як працює система
import cors from 'cors'; // інструмент безпеки для веб-додатків, який дозволяє обмінюватися інформацією між веб-ресурсами з різних доменів
import dotenv from 'dotenv'; // пакет для зчитувння та використання змінних оточення в додатку
import { env } from './utils/env.js'; // функція env, призначена для читання змінних оточення
// import contactsRouter from './routers/contacts.js';
import router from './routers/index.js'; // імпортуємо роутер
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser'; // пакет для роботи із куками

dotenv.config();

// читаємо змінну оточення PORT
const PORT = Number(env('PORT', '3000'));

export function setupServer() {
  const app = express();

  app.use(
    express.json({
      type: ['application/json'],
      limit: '100kb',
    }),
  ); // підключення мідлвару, який аналізує вхідні запити з JSON-пейлоадом і автоматично парсить їх у JavaScript-об'єкти
  app.use(cors());

  app.use(cookieParser()); //  використовуємо cookieParser() як middleware

  app.use(
    pino({
      transport: {
        target: 'pino-pretty', // доповнення для форматування логів
      },
    }),
  );

  // app.use(contactsRouter);
  app.use(router); // додаємо роутер до app як middleware

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    // запускає сервер на певному порту і виводить повідомлення в консоль, яке підтверджує успішний запуск сервера
    console.log(`Server is running on port ${PORT}`);
  });
}
