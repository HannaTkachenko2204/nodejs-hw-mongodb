import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

// підключення роутів, для взаємодіЇ з колекцією контактів і колекцією користувачів
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;