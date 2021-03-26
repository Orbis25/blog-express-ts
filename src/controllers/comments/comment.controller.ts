import express, { Request, Response } from "express";
import { jwtValidation } from "../../middlewares/jwt.middleware";

const app = express();

app.get(
  "/comments/:postId",
  jwtValidation,
  async (req: Request, res: Response) => {
    return res.status(200).json();
  }
);

export default app;
