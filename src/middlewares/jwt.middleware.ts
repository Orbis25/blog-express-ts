import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const jwtValidation = (
  req: Request | any,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ ok: false, error: "unauthorized" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ ok: false, error: "unauthorized" });
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string,
    (err: any, response: any) => {
      if (err)
        return res.status(401).json({ ok: false, error: "unauthorized" });
      req.user = response.result;
      next();
    }
  );
};
