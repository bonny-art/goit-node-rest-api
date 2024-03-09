import { Contact } from "../db/models/Contact.js";

export async function listContacts(userId) {
  const contacts = await Contact.find({ owner: userId });
  return contacts;
}

export async function getContactByIdAndOwner(contactId, userID) {
  const contact = await Contact.find({ _id: contactId, owner: userID });
  return contact;
}

export async function removeContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}

export async function addContact(name, email, phone, owner) {
  const newContact = new Contact({ name, email, phone, owner });
  const contact = await newContact.save();
  return contact;
}

export async function updateContact(contactId, newContactInfo) {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    newContactInfo,
    {
      new: true,
    }
  );
  return updatedContact;
}
