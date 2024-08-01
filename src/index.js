import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap(); // функція, яка буде ініціалізувати підключення до бази даних, після чого запускати сервер
