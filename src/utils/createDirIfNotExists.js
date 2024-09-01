// автоматизований скрипт, що буде відпрацьовувати при запуску додатку для створення папки для збереження файлів локально
// утіліта яка буде перевіряти, чи існує директорія за вказаним шляхом (url)
// якщо директорія не існує, то функція створить її
import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};