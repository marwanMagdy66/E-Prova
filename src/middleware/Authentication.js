import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../DB/models/User.js";



export const isAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers["token"] || req.cookies?.accessToken;

  if (!token) {
    return next(new Error("Authentication required! Please login first.", { cause: 401 }));
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    console.log(payload)
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return next(new Error("User not found!", { cause: 404 }));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new Error("Token verification failed!", { cause: 401 }));
  }
});
