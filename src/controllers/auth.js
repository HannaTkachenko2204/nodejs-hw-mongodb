import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => { // створюємо контролер для користувача
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};