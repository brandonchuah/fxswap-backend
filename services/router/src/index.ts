import "@fxswap/configs";
import { configs } from "@fxswap/configs";
import express from "express";
import { errorMiddleware } from "./middlewares/error";
import { router } from "./routes";

const init = async () => {
  const app = express();
  app.use(express.json());

  app.use("/", router);
  app.use(errorMiddleware);

  app.listen(configs.routerPort, () => {
    console.log(`Router listening on :${configs.routerPort}`);
  });
};

init().catch(console.error);
