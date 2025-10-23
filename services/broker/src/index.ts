import "@fxswap/configs";
import { configs } from "@fxswap/configs";
import express from "express";
import { errorMiddleware } from "./middlewares/error";
import { quoteRouter } from "./routes";

const init = async () => {
  const app = express();
  app.use(express.json());

  app.use("/quote", quoteRouter);

  app.use(errorMiddleware);

  app.listen(configs.brokerPort, () => {
    console.log(`Broker listening on :${configs.brokerPort}`);
  });
};

init().catch(console.error);
