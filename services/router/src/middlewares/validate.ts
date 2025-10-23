import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const quoteSchema = z.object({
  chainId: z.number().int().positive(),
  fromToken: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  toToken: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  receiver: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.string().regex(/^\d+$/),
});

export function validateQuote(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = quoteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }
  next();
}


