import { NextFunction, Request, Response } from "express";

export async function quote(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { fromToken, toToken, receiver, amount } = req.body;

    res.json({ ok: true, fromToken, toToken, receiver, amount });
  } catch (err) {
    if (err instanceof Error) {
      console.error(
        `quote error: ${err.message} - ${JSON.stringify(err.stack)}`,
      );
      next(err);
    } else {
      console.error(`quote error: ${JSON.stringify(err)}`);
      next(new Error("unknown error"));
    }
  }
}
