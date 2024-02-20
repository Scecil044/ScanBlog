import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptJs from "bcryptjs";

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

// Function ti update user details
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(403, "You do not have rights to update this profile")
    );
  if (req.body.password) {
    if (req.body.password.length < 6)
      return next(errorHandler(400, "Password must be more than 5 characters"));
    req.body.password = bcryptJs.hashSync(req.body.password, 10);
  }
  if (req.body.firstName || req.body.lastName) {
    if (
      req.body.firstName &&
      req.body.firstName !== req.body.firstName.toLowerCase()
    ) {
      return next(
        errorHandler(400, "First name must be in lowercase characters")
      );
    }
    if (
      req.body.lastName &&
      req.body.lastName !== req.body.lastName.toLowerCase()
    ) {
      return next(
        errorHandler(400, "Last name must be in lowercase characters")
      );
    }
    if (req.body.firstName && req.body.firstName.includes(" ")) {
      return next(errorHandler(400, "First name must not contain spaces"));
    }
    if (req.body.lastName && req.body.lastName.includes(" ")) {
      return next(errorHandler(400, "Last name must not contain spaces"));
    }
    if (req.body.firstName && !req.body.firstName.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "First name must not contain special characters")
      );
    }
    if (req.body.lastName && !req.body.lastName.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Last name must not contain special characters")
      );
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// function to delete account
export const deleteAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(403, "You do not have permission to delete this account")
    );
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account deleted!");
  } catch (error) {
    next(error);
  }
};
