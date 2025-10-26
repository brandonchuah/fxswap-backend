import { FxSwapClient } from "@fxswap/sdk";
import dotenv from "dotenv";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not set");
}

async function main(): Promise<void> {
  const account = privateKeyToAccount(PRIVATE_KEY);
  console.log(`Account: ${account.address}`);

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http(),
    account,
  });

  const client = new FxSwapClient("http://localhost:3001");

  const hash = await client.swap(walletClient, {
    fromToken: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9", // PYUSD
    toToken: "0x8a0c939571ef36363a5b4526a28ac59f623ebf97", // MockXSGD
    receiver: account.address,
    amount: parseUnits("1", 6).toString(),
  });

  console.log(`Swap successful: ${hash}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
