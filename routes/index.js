import express from "express";

import usersRoutes from "./usersRouter.js";
import contactsRoutes from "./contactsRouter.js";

import { auth } from "../services/authServices.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/contacts", auth, contactsRoutes);

export default router;
