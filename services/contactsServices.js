import { Contact } from "../db/models/Contact.js";

export async function listAllContacts(userId) {
  const totalContacts = await Contact.countDocuments({ owner: userId });
  const contacts = await Contact.find({ owner: userId });
  return {
    page: "All",
    limit: "All",
    totalPages: "All",
    totalItems: totalContacts,
    contacts,
  };
}

export async function listContacts(userId, query) {
  const totalContacts = await Contact.countDocuments({ owner: userId });

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 5;

  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalContacts / limit);

  const contacts = await Contact.find({ owner: userId })
    .skip(skip)
    .limit(limit);
  return { page, limit, totalPages, totalItems: totalContacts, contacts };
}

export async function getContactByIdAndOwner(contactId, userID) {
  const contact = await Contact.find({ _id: contactId, owner: userID });
  return contact;
}

export async function removeContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}

export async function isContactExisting(name, owner) {
  const existingContact = await Contact.find({ name, owner });

  return existingContact;
}

export async function addContact({ name, email, phone }, owner) {
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
