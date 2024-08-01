import dotenv from 'dotenv'; // пакет для зчитувння та використання змінних оточення в додатку

dotenv.config();

export function env(name, defaultValue) {
  // функція env, призначена для читання змінних оточення
  const value = process.env[name]; // глобальний об'єкт process.env, який доступний у коді будь-якого модуля

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}
