import express, { Request, Response } from "express";
import userSchema from "../../models/users/user.schema";
import { UserService } from "../../services/implementations";
import { FullDocumentEnum } from "../../services/repository/IBaseRepository";

const app = express();

const service = new UserService();

app.post("/user", async (req: Request, res: Response) => {
  const result = await service.create(new userSchema(req.body));
  if (!result.ok) {
    return res.status(400).json(result);
  }
  return res.status(201).json(result);
});

app.get("/users", async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const qyt = req.query.qyt || 10;
  const full = req.query.full || FullDocumentEnum.Paginated;

  const result = await service.getPaginatedAll(
    userSchema,
    Number(page),
    Number(qyt),
    undefined,
    full as FullDocumentEnum
  );
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await service.getById(userSchema, id);
  if (!result.ok) return res.status(404).json(result);
  return res.json(result);
});

app.put("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const result = await service.update(id, body, userSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

app.delete("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await service.delete(id, userSchema);
  if (!result.ok) return res.status(400).json(result);
  return res.json(result);
});

export default app;
