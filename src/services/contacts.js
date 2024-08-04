import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find(); // find() — це вбудований метод Mongoose для пошуку документів у MongoDB
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId); // findById() — це вбудований метод Mongoose для пошуку одного документа у MongoDB за його унікальним ідентифікатором
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};