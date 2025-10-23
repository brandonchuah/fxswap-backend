import { NextFunction, Request, Response } from "express";
import { AggregatorService } from "../services/Aggregator.service";

export async function quote(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const service = AggregatorService.getInstance();
    const result = await service.aggregate(req.body);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
