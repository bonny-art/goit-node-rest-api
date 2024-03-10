import HttpError from "../helpers/HttpError.js";

import * as ContactsService from "../services/contactsServices.js";

export const getContacts = async (req, res, next) => {
  try {
    const query = { owner: req.user.id };

    if (req.query.favorite) {
      query.favorite = req.query.favorite === "true";
    }

    var data;
    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;

      data = await ContactsService.listContacts(query, page, limit);
    } else {
      data = await ContactsService.listAllContacts(query);
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await ContactsService.getContactByIdAndOwner(
      req.params.contactId,
      req.user.id
    );
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
    const contact = await ContactsService.getContactByIdAndOwner(
      req.params.contactId,
      req.user.id
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }

    const deletedContact = await ContactsService.removeContact(
      req.params.contactId
    );

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const isContactExisting = await ContactsService.isContactExisting(
      req.body.name,
      req.user.id
    );
    if (isContactExisting) {
      throw HttpError(
        409,
        `Contact with name ${req.body.name} is already in phonebook`
      );
    }

    const contact = await ContactsService.addContact(req.body, req.user.id);
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

    const contact = await ContactsService.getContactByIdAndOwner(
      req.params.contactId,
      req.user.id
    );

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    const newContact = await ContactsService.updateContact(
      req.params.contactId,
      req.body
    );

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

    const contact = await ContactsService.getContactByIdAndOwner(
      req.params.contactId,
      req.user.id
    );
    if (!contact) {
      throw HttpError(404, "Not found");
    }

    const newContact = await ContactsService.updateContact(
      req.params.contactId,
      req.body
    );

    res.status(200).json(newContact);
  } catch (error) {
    next(error);
  }
};
