import express from "express";

import validateBody from "../helpers/validateBody.js";
import upload from "../services/uploadServices.js";

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
  uploadAvatar,
} from "../controllers/usersControllers.js";

import { auth } from "../services/authServices.js";
import { sendMail } from "../controllers/sendMailControllers.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(createUserSchema),
  createUser,
  sendMail
);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);
usersRouter.post("/logout", auth, logoutUser);
usersRouter.get("/current", auth, getCurrentUser);
usersRouter.patch("/", auth, validateBody(updateUserSchema), updateUser);
usersRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);

export default usersRouter;
