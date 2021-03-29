import express, { Request, Response } from "express";
import userSchema, {
  UserModel,
  UserAuthViewModel,
} from "../../models/users/user.schema";
import { UserService } from "../../services/implementations";
import { jwtValidation } from "../../middlewares/jwt.middleware";
import { stringToBoolean } from "../../utils/helpers/string.helpers";

const app = express();

const service = new UserService();

app.post("/user", async (req: Request, res: Response) => {
  const result = await service.save(req.body as UserModel);
  if (!result.ok) {
    return res.status(400).json(result);
  }
  return res.status(201).json(result);
});

app.get("/users", jwtValidation, async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const qyt = req.query.qyt || 10;
  const full = stringToBoolean(req.query.full as string) || false;

  const result = await service.getPaginatedAll(
    userSchema,
    Number(page),
    Number(qyt),
    undefined,
    full
  );
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.get("/user/:id", jwtValidation, async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await service.getById(userSchema, id);
  if (!result.ok) return res.status(404).json(result);
  return res.json(result);
});

app.put("/user/:id", jwtValidation, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const result = await service.update(id, body, userSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.delete("/user/:id", jwtValidation, async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await service.delete(id, userSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.post("/user/login", async (req: Request, res: Response) => {
  const body = req.body as UserAuthViewModel;
  if (!body.email)
    return res.status(400).json({ ok: false, error: "email is required" });
  if (!body.password)
    return res.status(400).json({ ok: false, error: "password is required" });

  const result = await service.login(body);
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.post(
  "/user/profile/upload",
  jwtValidation,
  async (req: Request, res: Response) => {
    const { user } = req as any;
    const result = await service.uploadPic(req.files, user._id);
    if (!result.ok) return res.status(500).json(result);
    return res.status(200).json(result);
  }
);

export default app;
