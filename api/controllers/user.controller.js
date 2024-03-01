import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptJs from "bcryptjs";

// function to get all users in the system
export const getUsers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const systemUsers = await User.find({
      ...(req.query.firstName && { firstName: req.query.firstName }),
      ...(req.query.lastName && { lastName: req.query.lastName }),
      ...(req.query.userName && { userName: req.query.userName }),
      ...(req.query.email && { email: req.query.email }),
      ...(req.query.userId && { _id: req.query.userId }),
      ...(req.query.searchTerm && {
        $or: [
          { email: { $regex: req.query.searchTerm, $options: "i" } },
          { lastName: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const systemUsersWithoutPasswords = systemUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: systemUsersWithoutPasswords,
      totalUsers,
      lastMonthUsers,
    });
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
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return next(
        errorHandler(404, `No user with matching id ${req.params.id} was found`)
      );
    res.status(200).json("Account deleted!");
  } catch (error) {
    next(error);
  }
};
