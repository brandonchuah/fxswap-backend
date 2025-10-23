import express, { Router } from "express";
import { quote } from "../controllers";
import { validateQuote } from "../middlewares/validate";

export const quoteRouter: Router = express.Router();

// middlewares

// Quote endpoint
quoteRouter.post("/", validateQuote, quote);
