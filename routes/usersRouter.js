import express from "express";

import validateBody from "../helpers/validateBody.js";

import { createUserSchema, loginUserSchema } from "../schemas/usersSchemas.js";

import { createUser, loginUser } from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);

export default usersRouter;
