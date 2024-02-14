import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptJs from "bcryptjs";

// Function to login users into the system
export const login = async (req, res, next) => {};

// Function to register new user
export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    email === "" ||
    lastName === "" ||
    firstName === "" ||
    password === ""
  )
    return next(errorHandler(400, "Please provide all required fields!"));
  try {
    // Function to generate userName
    const generateUserName = (firstName, lastName) => {
      const firstNameLower =
        firstName && firstName.length > 0
          ? firstName.charAt(0).toLowerCase()
          : "";
      const lastNameUpper =
        lastName && lastName.length > 0 ? lastName.charAt(0).toUpperCase() : "";
      const remainingParts =
        lastName && lastName.length > 0 ? lastName.slice(1).toLowerCase() : "";

      return (
        firstNameLower +
        lastNameUpper +
        remainingParts +
        Math.floor(100 + Math.random() * 900).toString()
      );
    };
    // Hash password
    const hashedPassword = bcryptJs.hashSync(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      userName: generateUserName(firstName, lastName),
      email,
      password: hashedPassword,
    });
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// Function to logout user from the system
export const logout = async (req, res, next) => {
  res.clearCookie("access_token").json("User logged out!");
};
