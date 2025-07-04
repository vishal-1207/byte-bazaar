import db from "../models/index.js";
import { v4 as uuid4 } from "uuid";
import jwt from "jsonwebtoken";

const RefreshToken = db.RefreshToken;

export default generateTokens = async ({ userId, roles }) => {
  const accessToken = jwt.sign({ userId, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const tokenId = uuid4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const refreshToken = jwt.sign(
    { tokenId, userId, roles },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );

  await RefreshToken.create({
    tokenId,
    userId,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
};
