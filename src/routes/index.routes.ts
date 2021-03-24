import express from "express";
import userController from "../controllers/users/user.controller";
import postController from "../controllers/posts/post.controller";

const app = express();

app.use(userController);
app.use(postController);

export default app;
