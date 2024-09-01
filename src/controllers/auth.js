import { THIRTY_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

// створюємо контролер для реєстрації
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

// створюємо контролер для login - виконує процес аутентифікації і повертає об'єкт сесії
export const loginUserController = async (req, res) => {
  // приймає об'єкти запиту (req) і відповіді (res)
  const session = await loginUser(req.body); // викликає функцію loginUser, передаючи їй тіло запиту (req.body), яке містить дані для входу (email та пароль)

  // refreshToken та sessionId зберігаються як http-only cookie, що означає, що вони доступні тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Вони мають термін дії тридцять днів
  res.cookie('refreshToken', session.refreshToken, {
    // встановлюємо куки refreshToken використовуючи метод res.cookie
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    // встановлюємо куки sessionId, використовуючи метод res.cookie
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });

  // формуємо JSON-відповідь, яка включає статусний код 200, повідомлення про успішний вхід користувача та дані, що містять accessToken
  res.json({
    // метод res.json для відправлення відповіді клієнту
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// Створюємо функцію в сервісі для logout
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    // перевіряємо, чи існує кукі sessionId у запиті
    await logoutUser(req.cookies.sessionId); // видаляємо сесію користувача з бази даних
  }

  // видаляємо відповідні куки з браузера клієнта, що забезпечує вихід користувача з системи на стороні клієнта
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  // відправляємо відповідь клієнту зі статусним кодом 204 (No Content)
  res.status(204).send();
};

const setupSession = (res, session) => {
  // встановлюємо два куки: refreshToken і sessionId, використовуючи метод res.cookie
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

// виконуємо процес оновлення сесії користувача і взаємодію з клієнтом через HTTP
export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    // оновлюємо сесію
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    // повертаємо об'єкт нової сесії
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};


// контролер, який буде обробляти запит на скидання паролю через емейл
export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

// контролер, який буде обробляти запит на зміну пароля
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};