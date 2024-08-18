import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => { // приймає об'єкт з параметрами page та perPage, що вказують номер сторінки та кількість записів на сторінці відповідно
  const limit = perPage; // ліміт записів, які мають бути повернуті на одній сторінці
  const skip = (page - 1) * perPage; // кількість записів, що мають бути пропущені перед початком видачі на поточній сторінці

  const contactsQuery = ContactsCollection.find(); // запит до колекції, find() — це вбудований метод Mongoose для пошуку документів у MongoDB
  const contactsCount = await ContactsCollection.find() // запит для підрахунку кількості документів в колекції
    .merge(contactsQuery) // поєднує запит contactsQuery з підрахунком
    .countDocuments(); // отримуємо загальну кількість записів

  const contacts = await contactsQuery.skip(skip).limit(limit).exec(); // exec() - виконує запрос та повертає проміс з результатом

  const paginationData = calculatePaginationData(contactsCount, perPage, page); // розрахунок даних пагінації на основі загальної кількості записів, ліміту та поточної сторінки

  return { // об'єкт, що містить масив з даними про студентів і додаткову інформацію про пагінацію
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId); // findById() — це вбудований метод Mongoose для пошуку одного документа у MongoDB за його унікальним ідентифікатором
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
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

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
