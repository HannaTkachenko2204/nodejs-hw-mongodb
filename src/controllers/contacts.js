import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js'; // імпортуємо функції сервісу contacts та використовуємо їх у контролерах
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getContactsController = async (req, res) => {
  // маршрут для отримання колекції всіх контактів
  const { page, perPage } = parsePaginationParams(req.query); // пагінаційні параметри

  const { sortBy, sortOrder } = parseSortParams(req.query); // параметри сортування

  const filter = { ...parseFilterParams(req.query), userId: req.user._id }; // додаємо userId до фільтру

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  // маршрут для отримання контакта за його id
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id); // передаємо userId в сервісну функцію

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
    throw createHttpError(404, 'Contact not found');
    // throw createHttpError([404], ('Contact not found'));
    // throw createHttpError.NotFound('Contact not found'));
  }

  // відповідь, якщо контакт знайдено
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contactData = { 
    ...req.body, 
    userId: req.user._id, // додаємо userId до даних контакту
    photo: photoUrl // додаємо URL фото до даних контакту
  };

  const contact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

// eslint-disable-next-line no-unused-vars
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const photo = req.file;

  /* в photo лежить обʼєкт файлу
		{
		  fieldname: 'photo',
		  originalname: 'download.jpeg',
		  encoding: '7bit',
		  mimetype: 'image/jpeg',
		  destination: '/Users/borysmeshkov/Projects/goit-study/students-app/temp',
		  filename: '1710709919677_download.jpeg',
		  path: '/Users/borysmeshkov/Projects/goit-study/students-app/temp/1710709919677_download.jpeg',
		  size: 7
	  }
	*/

  let photoUrl;

  // для локального зберігання
  // if (photo) {
  //   photoUrl = await saveFileToUploadDir(photo);
  // }

  if (photo) {
  // якщо змінна середовища ENABLE_CLOUDINARY встановлена в true, фото завантажується на Cloudinary, інакше — у локальну директорію
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await updateContact(contactId, req.user._id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!contact) {
    // cтворюємо та налаштовуємо помилку
    throw createHttpError(404, 'Contact not found');
    // throw createHttpError([404], ('Contact not found'));
    // throw createHttpError.NotFound('Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact.contact,
  });
};

// eslint-disable-next-line no-unused-vars
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    // cтворюємо та налаштовуємо помилку
    throw createHttpError(404, 'Contact not found');
    // throw createHttpError([404], ('Contact not found'));
    // throw createHttpError.NotFound('Contact not found'));
  }

  res.status(204).send();
};
