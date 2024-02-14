import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = res.cookies.access_token;

  if (!token) return next(errorHandler(403, "No token, Not Authorized!"));
  jwt.verify(token, process.env.JWT_sECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Not Authorized"));

    req.user = user;
    next();
  });
};
