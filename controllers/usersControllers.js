import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import crypto from "node:crypto";

import HttpError from "../helpers/HttpError.js";
import * as usersServ from "../services/userServices.js";
import { resizeImage } from "../services/imageServices.js";
import { sendMail } from "../services/sendMailServices.js";

export const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await usersServ.isUserExistant(normalizedEmail);
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email);

    const verificationToken = crypto.randomUUID();

    const newUser = await usersServ.createUser({
      ...req.body,
      email: normalizedEmail,
      avatarURL,
      verificationToken,
    });

    sendMail(req, newUser);

    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await usersServ.isUserExistant(normalizedEmail);

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await usersServ.isPasswordValid(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (user.verify === false) {
      throw HttpError(401, "Your email is not verified");
    }

    const loggedInUser = await usersServ.loginUser(user);

    res.send({
      token: loggedInUser.token,
      user: {
        email: loggedInUser.email,
        subscription: loggedInUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await usersServ.logoutUser(req.user.id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await usersServ.getCurrentUser(req.user.id);
    const { email, subscription } = currentUser;

    res.send({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw HttpError(400, "Body must have at least one field");
    }

    const newUser = await usersServ.updateUser(req.user.id, req.body);

    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Select an avatar file to upload");
    }

    await resizeImage(req.file.path, 250, 250);

    fs.rename(
      req.file.path,
      path.join(process.cwd(), "public", "avatars", req.file.filename)
    );

    const avatarURL = path.join("avatars", req.file.filename);
    await usersServ.updateUser(req.user.id, {
      avatarURL,
    });
    res.send({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verificateUser = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await usersServ.verifyUser(verificationToken);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await usersServ.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const reVerificateUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw HttpError(400, "Missing required field email");
    }

    const user = await usersServ.isUserExistant(email);

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
    }

    sendMail(req, user);

    res.send({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
