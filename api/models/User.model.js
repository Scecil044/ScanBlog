import mongoose from "mongoose";
import validator from "validator";

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "The first name field is required"],
    },
    lastName: {
      type: String,
      required: [true, "The last name field is required"],
    },
    userName: {
      type: String,
      required: [true, "The User name field is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "The email field is required"],
      unique: true,
      validate: [validator.isEmail, "Invalid Email address"],
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    },
    password: {
      type: String,
      required: [true, "The password field is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
export default User;
