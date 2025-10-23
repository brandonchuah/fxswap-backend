import { BrokerResponse } from "@fxswap/interfaces";
import { NextFunction, Request, Response } from "express";
import { BROKER_ADDRESS } from "../constants";
import { FxRateService } from "../services/FxRate.service";
import { SignatureService } from "../services/Signature.service";

export async function quote(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { chainId, fromToken, toToken, receiver, amount } = req.body;

    const fxRate = await FxRateService.getInstance().getRateFromTokenAddresses(
      fromToken,
      toToken,
      chainId,
      chainId,
    );

    const deadline = (Math.floor(Date.now() / 1000) + 120).toString(); // 2 minutes

    const signature = await SignatureService.getInstance().signQuote(
      { chainId, fromToken, toToken, receiver, amount },
      fxRate,
      deadline,
    );

    const response: BrokerResponse = {
      chainId,
      brokerAddress: BROKER_ADDRESS,
      fromToken,
      toToken,
      receiver,
      amount,
      fxRate,
      deadline,
      signature,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
