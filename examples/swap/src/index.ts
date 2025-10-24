import { FxSwapClient } from "@fxswap/sdk";
import { parseUnits } from "viem";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { sepolia } from "viem/chains";

async function main(): Promise<void> {
  const client = new FxSwapClient(
    process.env.ROUTER_URL || "http://localhost:3001",
  );

  const res = await client.quote({
    chainId: sepolia.id,
    fromToken: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9", // PYUSD
    toToken: "0x8a0c939571ef36363a5b4526a28ac59f623ebf97", // MockXSGD
    receiver: privateKeyToAddress(generatePrivateKey()),
    amount: parseUnits("1", 18).toString(),
  });

  console.log(res);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
