import { THIRTY_DAY } from '../constants/index.js';
import { loginUser, registerUser } from '../services/auth.js';


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
export const loginUserController = async (req, res) => { // приймає об'єкти запиту (req) і відповіді (res)
  const session = await loginUser(req.body); // викликає функцію loginUser, передаючи їй тіло запиту (req.body), яке містить дані для входу (email та пароль)

  // refreshToken та sessionId зберігаються як http-only cookie, що означає, що вони доступні тільки через HTTP-запити і не може бути доступним через JavaScript на стороні клієнта. Вони мають термін дії тридцять днів
  res.cookie('refreshToken', session.refreshToken, { // встановлюємо кук refreshToken використовуючи метод res.cookie
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie('sessionId', session._id, { // встановлюємо кук sessionId, використовуючи метод res.cookie
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });


  // формуємо JSON-відповідь, яка включає статусний код 200, повідомлення про успішний вхід користувача та дані, що містять accessToken
  res.json({ // метод res.json для відправлення відповіді клієнту
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
