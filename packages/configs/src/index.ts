import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });

export const configs = {
  // broker configs
  brokerPort: process.env.BROKER_PORT || "3000",
  fastForexApiKey: process.env.FAST_FOREX_API_KEY || "",
  brokerSignerPrivateKey: process.env.BROKER_SIGNER_PRIVATE_KEY || "",
  // router configs
  brokerEndpoints: process.env.BROKER_ENDPOINTS || "",
  routerPort: process.env.ROUTER_PORT || "3001",
};
