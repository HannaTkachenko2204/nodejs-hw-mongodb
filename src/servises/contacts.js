import { ContacnsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContacnsCollection.find();
    return contacts;
  };
  
  export const getContactById = async (contactId) => {
    const contact = await ContacnsCollection.findById(contactId);
    return contact;
  };