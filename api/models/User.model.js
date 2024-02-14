import mongoose from "mongoose";

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
    },
    password: {
      type: String,
      required: [true, "The password field is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
export default User;
