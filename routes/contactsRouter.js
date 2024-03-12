import express from "express";

import validateBody from "../helpers/validateBody.js";
import validateID from "../helpers/validateID.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import {
  getContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import validateID from "../helpers/validateID.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getContacts);

contactsRouter.get("/:contactId", validateID, getOneContact);

contactsRouter.delete("/:contactId", validateID, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put(
  "/:contactId",
  validateID,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:contactId/favorite",
  validateID,
  validateBody(updateContactSchema),
  updateStatusContact
);

export default contactsRouter;
