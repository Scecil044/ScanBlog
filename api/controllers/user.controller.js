import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";

// function to get all users in the system
export const getUsers = async (req, res, next) => {
  try {
    const systemUsers = await User.find();
    const systemUsersWithoutPasswords = systemUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    res.status(200).json(systemUsersWithoutPasswords);
  } catch (error) {
    next(error);
  }
};
