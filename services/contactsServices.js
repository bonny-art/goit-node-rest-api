import { Contact } from "../db/models/Contact.js";


export async function listAllContacts(query) {
  const totalContacts = await Contact.countDocuments(query);
  const contacts = await Contact.find(query);
  return {
    page: 1,
    limit: "All",
    totalPages: 1,
    itemsOnPage: totalContacts,
    totalItems: totalContacts,
    contacts,
  };
}

export async function listContacts(query, page, limit) {
  const totalContacts = await Contact.countDocuments(query);
  const totalPages = Math.ceil(totalContacts / limit);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * limit;

  const contacts = await Contact.find(query).skip(skip).limit(limit);
  return {
    page,
    limit,
    totalPages,
    itemsOnPage: contacts.length,
    totalItems: totalContacts,
    contacts,
  };
}

export async function getContactByIdAndOwner(contactId, userID) {
  const contact = await Contact.findOne({ _id: contactId, owner: userID });

  return contact;
}

export async function removeContact(contactId) {
  const contact = await Contact.findByIdAndDelete(contactId);
  return contact;
}


export async function isContactExisting(name, owner) {
  const existingContact = await Contact.findOne({ name, owner });

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
