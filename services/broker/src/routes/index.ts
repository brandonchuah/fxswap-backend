import express, { Router } from "express";
import { quote } from "../controllers";

export const quoteRouter: Router = express.Router();

// middlewares

// Quote endpoint
quoteRouter.post("/", quote);
