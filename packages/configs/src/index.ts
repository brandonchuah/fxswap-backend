import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const configs = {
  fastForexApiKey: process.env.FAST_FOREX_API_KEY || "",
  brokerSignerPrivateKey: process.env.BROKER_SIGNER_PRIVATE_KEY || "",
};

console.log("configs in configs", configs);
