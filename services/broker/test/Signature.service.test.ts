import {
  PYUSD_CONTRACT_ADDRESS,
  XSGD_CONTRACT_ADDRESS,
} from "@fxswap/constants";
import { BrokerRequest } from "@fxswap/interfaces";
import { parseUnits } from "viem";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";
import { sepolia } from "viem/chains";
import { beforeAll, describe, expect, it } from "vitest";

let signatureService: any;

describe("SignatureService", () => {
  beforeAll(async () => {
    if (!process.env.BROKER_SIGNER_PRIVATE_KEY) {
      process.env.BROKER_SIGNER_PRIVATE_KEY = generatePrivateKey();
    }
    const mod = await import("../src/services/Signature.service");
    signatureService = mod.SignatureService.getInstance();
  });

  it("signs quote and returns signature", async () => {
    const request: BrokerRequest = {
      chainId: sepolia.id,
      fromToken: PYUSD_CONTRACT_ADDRESS.sepolia,
      toToken: XSGD_CONTRACT_ADDRESS.sepolia,
      receiver: privateKeyToAddress(generatePrivateKey()),
      amount: parseUnits("100", 18).toString(),
    };

    const signature = await signatureService.signQuote(
      request,
      parseUnits("1.25", 18).toString(),
      (Math.floor(Date.now() / 1000) + 120).toString(),
    );

    expect(signature.startsWith("0x")).toBe(true);
    expect(signature.length).toBe(132);
  });
});
