import HttpError from "../helpers/HttpError.js";

import * as usersServ from "../services/userServices.js";

export const createUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();
    const user = await usersServ.isUserExistant(normalizedEmail);
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const newUser = await usersServ.createUser({
      ...req.body,
      email: normalizedEmail,
    });
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
