import path from 'node:path'; // додаємо шаблонізатор

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000; // мілісекунди
export const THIRTY_DAY = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates'); // додаємо шаблонізатор

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp'); // тимчасова директорія для завантажень
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');