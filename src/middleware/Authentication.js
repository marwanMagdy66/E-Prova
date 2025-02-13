import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Token } from "../../DB/models/Token.js";
import { User } from "../../DB/models/User.js";
export const isAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers["token"];
  if (!token) {
    return next(new Error("Token is required!", { cause: 400 }));
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return next(new Error("Token verification failed!", { cause: 401 }));
  }

  const tokenDB = await Token.findOne({ token: token, isValid: true });
  if (!tokenDB) {
    return next(new Error("Token is invalid or expired!", { cause: 401 }));
  }
  const user = await User.findById(payload.id);
  if (!user) {
    return next(new Error("User not found!", { cause: 404 }));
  }
  req.user = user;
  next();
});
