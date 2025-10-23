import "@fxswap/configs";
import express from "express";
import { errorMiddleware } from "./middlewares/error";
import { router } from "./routes";

const init = async () => {
  const app = express();
  app.use(express.json());

  app.use("/", router);
  app.use(errorMiddleware);

  const port = parseInt(process.env.ROUTER_PORT || "3001", 10);
  app.listen(port, () => {
    console.log(`Router listening on :${port}`);
  });
};

init().catch(console.error);
