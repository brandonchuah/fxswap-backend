import { NextFunction, Request, Response } from "express";

export async function quote(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
  } catch (error) {
    next(error);
  }
}
