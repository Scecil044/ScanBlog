import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/PostsController.js";

const router = express.Router();

router.get("/get/post/:id", getPost);
router.get("/get/posts", getPosts);
router.post("/create/post", verifyToken, createPost);
router.put("/update/post/:id", verifyToken, updatePost);
router.delete("/delete/post/:id", verifyToken, deletePost);

export default router;
