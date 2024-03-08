import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { getUserById } from "./userServices.js";

export const auth = async (req, res, next) => {
  const headerAuth = req.headers.authorization;

  try {
    if (!headerAuth) {
      throw HttpError(401, "Not authorized");
    }

    const [bearer, token] = headerAuth.split(" ", 2);

    if (bearer !== "Bearer") {
      throw HttpError(401, "Not authorized");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw HttpError(401, "Token expired");
        }

        throw HttpError(401, "Not authorized");
      }

      req.user = {
        id: decoded.id,
      };
    });

    const reqUser = req.user;
    const user = await getUserById(reqUser.id);

    if (!user) {
      delete req.user;
      throw HttpError(401, "Not authorized - no such user");
    }

    if (token !== user.token) {
      delete req.user;
      throw HttpError(401, "Not authorized - token doesn`t match");
    }

    next();
  } catch (error) {
    next(error);
  }
};
