import express from "express";
import userController from "../controllers/users/user.controller";

const app = express();

app.use(userController);

export default app;
