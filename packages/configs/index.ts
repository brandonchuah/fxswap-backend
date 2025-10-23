import dotenv from "dotenv";

dotenv.config();

export const configs = {
  fastForexApiKey: process.env.FAST_FOREX_API_KEY || "",
  brokerSignerPrivateKey: process.env.BROKER_SIGNER_PRIVATE_KEY || "",
};
