import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt'; // застосовуємо бібліотеку хешування для зберігання паролю
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAY } from '../constants/index.js';

export const registerUser = async (payload) => {
  //return await UsersCollection.create(payload);

  const user = await UsersCollection.findOne({ email: payload.email }); // перевіряємо email на унікальність під час реєстрації
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  // створюємо функцію в сервісі для створення користувача
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

// cтворюємо функцію в сервісі для login (процес аутентифікації користувача)
export const loginUser = async (payload) => {
  // об'єкт payload містить дані для входу, такі як email та пароль
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found'); // помилка з кодом 404, вказує, що користувач не знайдений
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // порівнюємо введений користувачем пароль з хешованим паролем, збереженим у базі даних

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized'); // помилка з кодом 401, вказує, що користувач неавторизований
  }

  await SessionsCollection.deleteOne({ userId: user._id }); // видаляємо попередню сесію користувача, якщо така існує, з колекції сесій

  const accessToken = randomBytes(30).toString('base64'); // генеруються нові токени доступу та оновлення
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    // створюємо нову сесію в базі даних :)
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  });
};
