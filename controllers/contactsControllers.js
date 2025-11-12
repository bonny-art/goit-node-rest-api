import HttpError from "../helpers/HttpError.js";
import * as ContactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const contacts = await ContactsService.listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const contact = await ContactsService.getContactById(req.params.id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const contact = await ContactsService.addContact(name, email, phone);
  res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400, "Body must have at least one field");
  }

  const newContact = await ContactsService.updateContact(
    req.params.id,
    req.body
  );
  if (!newContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(newContact);
};

export const deleteContact = async (req, res, next) => {
  const contact = await ContactsService.removeContact(req.params.id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
};
