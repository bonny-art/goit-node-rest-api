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

    const loggedInUser = await usersServ.loginUser(user);
    console.log("🚀 ~ loggedInUser in controllers:", loggedInUser);

    res.status(200).send({
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
