import HttpError from "../helpers/HttpError.js";

import * as ContactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  console.log("🚀 ~ req.user contacts controller:", req.user);

  try {
    const contacts = await ContactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await ContactsService.getContactById(req.params.contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await ContactsService.removeContact(req.params.contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const contact = await ContactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }
    const newContact = await ContactsService.updateContact(
      req.params.contactId,
      req.body
    );
    if (!newContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).includes("favorite")) {
      throw HttpError(400, "No property 'favorite'");
    }
    const newContact = await ContactsService.updateContact(
      req.params.contactId,
      req.body
    );

    if (!newContact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(newContact);
  } catch (error) {
    next(error);
  }
};
