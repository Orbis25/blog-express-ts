import express, { Request, Response } from "express";
import { jwtValidation } from "../../middlewares/jwt.middleware";

import CommentService from "../../services/implementations/comments/comment.service";
import { stringToBoolean } from "../../utils/helpers/string.helpers";
import PostService from "../../services/implementations/posts/post.service";
import CommentSchema, {
  CommentModel,
} from "../../models/comments/comment.model";
import PostSchema from "../../models/posts/post.schema";

const app = express();

const _commentService = new CommentService();
const _postService = new PostService();

app.get(
  "/comments/:postId",
  jwtValidation,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const page = Number(req.query.page) || 1;
    const qyt = Number(req.query.qyt) || 10;
    const isFull = stringToBoolean(req.query.isFull as string) || false;
    const result = await _commentService.getAllComments(
      postId,
      page,
      qyt,
      isFull
    );
    if (!result.ok) return res.status(400).json(result);
    return res.status(200).json(result);
  }
);

app.post("/comment", jwtValidation, async (req: Request, res: Response) => {
  const body = req.body as CommentModel;
  const { user }: any = req;
  body.user = user._id;
  const existPost = await _postService.getById(PostSchema, body.post);
  if (!existPost.ok) return res.status(404).json(existPost);
  const result = await _commentService.create(new CommentSchema(body));
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.get("/comment/:id", jwtValidation, async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await _commentService.getById(CommentSchema, id, [
    "post",
    "user",
  ]);
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.delete(
  "/comment/:id",
  jwtValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await _commentService.delete(id, CommentSchema);
    if (!result.ok) return res.status(400).json(result);
    return res.status(200).json(result);
  }
);

app.put("/comment/:id", jwtValidation, async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as CommentModel;
  const result = await _commentService.update(id, body, CommentSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

export default app;
