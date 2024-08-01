import express from 'express'; // JavaScript бібліотека, яка призначена для розробки вебдодатків і API. Express побудований на базі Node.js
import pino from 'pino-http'; // логування дозволяє слідкувати за тим, як працює система
import cors from 'cors'; // інструмент безпеки для веб-додатків, який дозволяє обмінюватися інформацією між веб-ресурсами з різних доменів
import dotenv from 'dotenv'; // пакет для зчитувння та використання змінних оточення в додатку
import { env } from './utils/env.js'; // функція env, призначена для читання змінних оточення
import { getAllContacts, getContactById } from './servises/contacts.js'; // імпортуємо функції сервісу contacts та використовуємо їх у контролерах

dotenv.config();

// читаємо змінну оточення PORT
const PORT = Number(env('PORT', '3000'));

export function setupServer() {
  const app = express();

  app.use(express.json()); // підключення мідлвару, який аналізує вхідні запити з JSON-пейлоадом і автоматично парсить їх у JavaScript-об'єкти
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty', // доповнення для форматування логів
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    // маршрут для отримання колекції всіх контактів
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.get('/contacts/:contactId', async (req, res, next) => {
    // маршрут для отримання контакта за його id
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    // Відповідь, якщо контакт не знайдено
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    // відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact with id {**contactId**}!',
      data: contact,
    });
  });

  // eslint-disable-next-line no-unused-vars
  app.use('*', (req, res, next) => {
    // мідлвар в Express.js, який обробляє всі запити, що не відповідають жодному з визначених маршрутів
    res.status(404).send({ status: 404, message: 'Route not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    // мідлвар для обробки помилок у Express.js додатку
    console.error(error);
    res.status(500).send({ status: 500, message: 'Internal Server Error' });
  });

  app.listen(PORT, () => {
    // запускає сервер на певному порту і виводить повідомлення в консоль, яке підтверджує успішний запуск сервера
    console.log(`Server is running on port ${PORT}`);
  });
}
