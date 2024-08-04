import {
  createContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js'; // імпортуємо функції сервісу contacts та використовуємо їх у контролерах
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  // маршрут для отримання колекції всіх контактів
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// eslint-disable-next-line no-unused-vars
export const getContactByIdController = async (req, res, next) => {
  // маршрут для отримання контакта за його id
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  // відповідь, якщо контакт не знайдено
  // if (!contact) {
  //   res.status(404).json({
  //     message: 'Contact not found',
  //   });
  //   return;
  // }

  // тепер додаємо базову обробку помилки замість res.status(404)
  //   if (!contact) {
  //     next(new Error('Contact not found'));
  //     return;
  //   }

  if (!contact) {
    // cтворюємо та налаштовуємо помилку
    throw createHttpError(404, 'Student not found');
    // throw createHttpError([404], ('Student not found'));
    // throw createHttpError.NotFound('Student not found'));
  }

  // відповідь, якщо контакт знайдено
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a student!`,
    data: contact,
  });
};
