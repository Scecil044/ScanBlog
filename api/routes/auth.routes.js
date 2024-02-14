import express from "express";
import {
  googleAuth,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/logout", verifyToken, logout);

export default router;
