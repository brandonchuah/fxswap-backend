import express from "express";
import { errorMiddleware } from "./middlewares/error";
import { quoteRouter } from "./routes";

const init = async () => {
  const app = express();
  app.use(express.json());

  app.use("/quote", quoteRouter);

  app.use(errorMiddleware);

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

init().catch(console.error);
