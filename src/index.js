import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR); // утиліта createDirIfNotExists буде перевіряти, чи існує директорія за вказаним шляхом (url)
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

bootstrap(); // функція, яка буде ініціалізувати підключення до бази даних, після чого запускати сервер
