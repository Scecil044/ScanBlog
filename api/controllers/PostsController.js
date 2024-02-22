import { errorHandler } from "../utils/error.js";
import Post from "../models/Post.js";

// Function to get posts
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.title }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    // Get total number of posts
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    // last one month
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastOneMonth = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastOneMonth,
    });
  } catch (error) {
    next(error);
  }
};

//Function to create new post
export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(
      errorHandler(403, "You do not have rights to execute this action!")
    );
  if (
    !req.body.title ||
    !req.body.content ||
    req.body.title === "" ||
    req.body.content === ""
  )
    return next(errorHandler(400, "Please provide the title and post content"));
  try {
    const slug = req.body.title
      .split(" ")
      .join("_")
      .toLowerCase()
      .replace(/^[a-zA-Z0-9]/g, "");
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.body.downloadUrl,
      slug,
      userId: req.user.id,
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    next(error);
  }
};

// Function to update post
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return next(
        errorHandler(
          404,
          `No record with the provided 1d:${req.params.postId} was found`
        )
      );
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// Function to delete post
export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.id)
    return next(
      errorHandler(403, "You do not have permission to perform this action")
    );
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post deleted successfully");
  } catch (error) {
    next(error);
  }
  // console.log("Delete post works as well");
};

export const updatePost = async (req, res, next) => {
  if (req.user.id !== req.params.id || !req.user.isAdmin) {
    return next(errorHandler(403, "You have no rights to perform this action"));
  }
  try {
    const post = await Post.findById(req.params.postId);
    if (!post)
      return next(
        errorHandler(404, `No post with id: ${req.params.postId} was found`)
      );

    //update
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.downloadUrl,
          category: req.body.category,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
