import express from "express";

import validateBody from "../helpers/validateBody.js";

import { createUserSchema } from "../schemas/usersSchemas.js";

import { createUser } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);

export default usersRouter;
