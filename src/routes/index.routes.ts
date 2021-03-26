import express from "express";
import userController from "../controllers/users/user.controller";
import postController from "../controllers/posts/post.controller";
import commentController from "../controllers/comments/comment.controller";

const app = express();

app.use(userController);
app.use(postController);
app.use(commentController);

export default app;
