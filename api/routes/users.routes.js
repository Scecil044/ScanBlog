import express from "express";
import {
  deleteAccount,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/get/Users", getUsers);
router.put("/update/user/:id", verifyToken, updateUser);
router.delete("/delete/account/:id", verifyToken, deleteAccount);

export default router;
