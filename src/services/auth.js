import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt'; // застосовуємо бібліотеку хешування для зберігання паролю
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import {
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAY,
} from '../constants/index.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendMail.js';
import { env } from '../utils/env.js';
// додаємо шаблонізатор:
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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

// створюємо функцію в сервісі для logout
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

// створюємо функцію в сервісі для refresh (виконує процес оновлення сесії користувача і взаємодію з базою даних через асинхронні запити)
const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil); // якщо поточна дата перевищує значення refreshTokenValidUntil, це означає, що токен сесії прострочений

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(); // генеруємо нові accessToken і refreshToken, а також встановлюємо терміни їхньої дії

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    // створюємо та повертаємо нову сесію в колекції SessionsCollection, використовуючи ідентифікатор користувача з існуючої сесії та дані нової сесії, згенеровані функцією createSession
    userId: session.userId,
    ...newSession,
  });
};

// сервісна функція на скидання паролю через емейл
export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email }); // шукаємо користувача в колекції користувачів за вказаною електронною поштою
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    // створюємо токен скидання пароля, який містить ідентифікатор користувача та його електронну пошту.
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m', //  токен підписується секретом JWT і має термін дії 5 хвилин
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (await fs.readFile(resetPasswordTemplatePath)) // читаємо контент шаблона із файла
    .toString();

  const template = handlebars.compile(templateSource); // передаємо контент шаблона в функцію handlebars.compile()
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    // надсилаємо електронний лист користувачу, який містить посилання для скидання пароля з включеним створеним токеном
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    // html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`,
    html,
  });
};

// сервісна функція на зміну пароля
export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
