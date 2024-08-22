import bcrypt from 'bcrypt'; // застосовуємо бібліотеку хешування для зберігання паролю
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';

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

// cтворюємо функцію в сервісі для login
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  // далі ми доповнемо цей сервіс
};
