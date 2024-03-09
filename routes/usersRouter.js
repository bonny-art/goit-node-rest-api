import express from "express";

import validateBody from "../helpers/validateBody.js";

import { createUserSchema, loginUserSchema } from "../schemas/usersSchemas.js";

import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/usersControllers.js";

import { auth } from "../services/authServices.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);
usersRouter.get("/logout", auth, logoutUser);
usersRouter.get("/current", auth, getCurrentUser);

export default usersRouter;
