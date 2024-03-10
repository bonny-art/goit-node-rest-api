import express from "express";

import validateBody from "../helpers/validateBody.js";

import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/usersSchemas.js";

import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
} from "../controllers/usersControllers.js";

import { auth } from "../services/authServices.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), createUser);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);
usersRouter.get("/logout", auth, logoutUser);
usersRouter.get("/current", auth, getCurrentUser);
usersRouter.patch("/", auth, validateBody(updateUserSchema), updateUser);

export default usersRouter;
