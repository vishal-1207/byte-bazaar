import db from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/token.utils.js";

const User = db.User;

export const createUser = async (userData) => {
  const { username, email, password } = userData;

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  });

  if (existingUser) {
    const message =
      existingUser.username === username
        ? "Username is already taken."
        : "Email is already registered.";

    console.error();
    throw new Error(message);
  }

  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return {
    user: newUser,
  };
};

export const findUser = async (userData) => {
  const { userid, password } = userData;
  const user = await User.findOne({
    where: {
      [Op.or]: [{ username: userid }, { email: userid }],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = await generateAccessToken({
    id: user.id,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};
