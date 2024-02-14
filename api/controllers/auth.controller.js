import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptJs from "bcryptjs";
import jwt from "jsonwebtoken";

// Function to login users into the system
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "")
    return next(errorHandler(400, "Provide your email and password!"));
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(errorHandler(403, "Invalid credentials"));
    const isValidPassword = bcryptJs.compareSync(
      password,
      existingUser.password
    );
    if (!isValidPassword) return next(errorHandler(403, "Invalid credentials"));

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

    existingUser.password = undefined;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(existingUser);
  } catch (error) {
    next(error);
  }
};

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
    // Check if email exists
    const isExistingEmail = await User.findOne({ email: email });
    if (isExistingEmail) return next(errorHandler(403, "Email already taken!"));
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

// Function to authenticate with google
export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.password = undefined;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user);
    } else {
      // Function to generate random password
      const generatePassword = (length) => {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let randomString = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
        return randomString;
      };
      // generate token
      // Create new user with provided details
      const firstName = req.body.displayName
        .split(" ")
        .join("")
        .charAt(0)
        .toLowerCase();
      const lastNameUpper = req.body.displayName
        .split(" ")[1]
        .charAt(0)
        .toUpperCase();
      const lastNameLower = req.body.displayName
        .split(" ")[1]
        .slice(1)
        .toLowerCase();
      const generatedUserName =
        firstName +
        lastNameUpper +
        lastNameLower +
        Math.floor(100 + Math.random() * 900).toString();
      const newUser = await User.create({
        firstName,
        lastName: req.body.displayName.split(" ")[1],
        userName: generatedUserName,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: generatePassword(10),
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      newUser.password = undefined;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(newUser);
    }
  } catch (error) {
    next(error);
  }
};

// Function to logout user from the system
export const logout = async (req, res, next) => {
  res.clearCookie("access_token").json("User logged out!");
};
