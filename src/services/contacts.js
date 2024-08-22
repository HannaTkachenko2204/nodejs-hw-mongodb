import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  // приймає об'єкт з параметрами page та perPage, що вказують номер сторінки та кількість записів на сторінці відповідно + параметри sortOrder та sortBy дозволяють визначити порядок сортування та поле, за яким потрібно виконати сортування (_id за замовчуванням)
  const limit = perPage; // ліміт записів, які мають бути повернуті на одній сторінці
  const skip = (page - 1) * perPage; // кількість записів, що мають бути пропущені перед початком видачі на поточній сторінці

  const contactsQuery = ContactsCollection.find({ userId }); // фільтрація за userId // запит до колекції, find() — це вбудований метод Mongoose для пошуку документів у MongoDB

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find({ userId }).merge(contactsQuery).countDocuments(), // запит для підрахунку кількості документів в колекції, merge - поєднує запит contactsQuery з підрахунком, countDocuments - отримуємо загальну кількість записів
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(), // exec() - виконує запрос та повертає проміс з результатом
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page); // розрахунок даних пагінації на основі загальної кількості записів, ліміту та поточної сторінки

  return {
    // об'єкт, що містить масив з даними про контакти і додаткову інформацію про пагінацію
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findById({ _id: contactId, userId }); // findById() — це вбудований метод Mongoose для пошуку одного документа у MongoDB за його унікальним ідентифікатором
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, userId, payload) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
