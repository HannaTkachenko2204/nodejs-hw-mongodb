import { loginUser, registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => { // створюємо контролер для реєстрації
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => { // створюємо контролер для login
  await loginUser(req.body);

  // далі ми доповнемо цей контролер

  res.status(201).json({
    status: 201,
    message: 'Successfully login!'
  });
};