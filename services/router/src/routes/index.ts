import express, { Router } from "express";
import { quote } from "../controllers";
import { validateQuote } from "../middlewares/validate";

export const router: Router = express.Router();

router.post("/quote", validateQuote, quote);
