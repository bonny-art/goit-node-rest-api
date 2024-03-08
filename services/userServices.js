import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { User } from "../db/models/User.js";

export const isUserExistant = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const createToken = async (id) => {
  const payload = { id };
  const { SECRET_KEY } = process.env;
  const token = jwt.sign(payload, SECRET_KEY);

  return token;
};

export const createUser = async ({ email, password }) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = new User({ email, password: hashedPassword });
  await user.save();

  return user;
};

export const isPasswordValid = async (password, hashedPassword) => {
  const isValid = await bcryptjs.compare(password, hashedPassword);
  return isValid;
};

export const loginUser = async (user) => {
  const token = await createToken(user._id);

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  return user;
};
