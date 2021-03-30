import express, { Request, Response } from "express";
import { PostService } from "../../services/implementations/";
import { jwtValidation } from "../../middlewares/jwt.middleware";
import PostSchema, { PostModel } from "../../models/posts/post.schema";
import { stringToBoolean } from "../../utils/helpers/string.helpers";
import { LikeModel } from "../../models/posts/like.schema";

const app = express();

const _postService = new PostService();

app.post("/post", jwtValidation, async (req: Request, res: Response) => {
  const { user } = req as any;
  const body = (req.body as PostModel) || null;
  body.user = user._id;
  if (!body) return res.status(400).json("invalid body");
  const result = await _postService.create(new PostSchema(body));
  if (!result.ok) return res.status(400).json(result);
  return res.status(201).json(result);
});

app.get("/posts", jwtValidation, async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const qyt = Number(req.query.qyt) || 10;
  const isFull = stringToBoolean(req.query.full as string) || false;

  const result = await _postService.getPaginatedAll(
    PostSchema,
    page,
    qyt,
    undefined,
    isFull
  );
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.put("/post/:id", jwtValidation, async (req: Request, res: Response) => {
  const body = (req.body as PostModel) || null;
  const { id } = req.params;
  if (!body) return res.status(400).json("invalid body");
  const result = await _postService.update(id, body, PostSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.get("/post/:id", jwtValidation, async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await _postService.getById(PostSchema, id, ["user"]);
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.delete("/post/:id", jwtValidation, async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await _postService.delete(id, PostSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.post("/post/like", jwtValidation, async (req: Request, res: Response) => {
  const body = req.body as LikeModel;
  const { user } = req as any;
  body.user = user._id;
  const result = await _postService.setLike(body);
  if (!result.ok) return res.status(400).json(result);
  return res.status(200).json(result);
});

app.delete(
  "/post/like/:postId",
  jwtValidation,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { user } = req as any;
    const result = await _postService.removeLike({
      post: postId,
      user: user._id as string,
    });
    if (!result.ok) return res.status(400).json(result);
    return res.status(200).json(result);
  }
);

app.get(
  "/post/like/:postId",
  jwtValidation,
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { user } = req as any;
    const result = await _postService.userLiked({
      post: postId,
      user: user._id,
    });
    if (!result.ok) return res.status(400).json(result);
    return res.status(200).json(result);
  }
);

app.post(
  "/post/upload/:id",
  jwtValidation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await _postService.uploadImage(req.files, id);
    if (!result.ok) return res.status(500).json(result);
    return res.status(200).json(result);
  }
);

export default app;
