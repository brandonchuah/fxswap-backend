import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const error = err instanceof Error ? err : new Error(String(err));
  res.status(400).json({ error: error.message });
}


