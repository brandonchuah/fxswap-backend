import { configs } from "@fxswap/configs";
import { FX_SWAP_MODULE_CONTRACT_ADDRESS } from "@fxswap/constants";
import { BrokerRequest } from "@fxswap/interfaces";
import { Account, Hex, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export class SignatureService {
  private static instance: SignatureService | undefined;
  private readonly account: Account | undefined;

  private constructor() {
    if (!configs.brokerSignerPrivateKey) {
      throw new Error("BROKER_SIGNER_PRIVATE_KEY is not set");
    }
    this.account = privateKeyToAccount(configs.brokerSignerPrivateKey as Hex);
  }

  static getInstance(): SignatureService {
    if (!this.instance) {
      this.instance = new SignatureService();
    }
    return this.instance;
  }

  async signQuote(
    payload: BrokerRequest,
    fxRate: string,
    deadline: string,
  ): Promise<Hex> {
    const types = {
      swap: [
        { name: "fromToken", type: "address" },
        { name: "toToken", type: "address" },
        { name: "receiver", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "fxRate", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    } as const;

    const toBigInt = (v: string | bigint): bigint =>
      typeof v === "bigint" ? v : BigInt(v);

    const message = {
      fromToken: getAddress(payload.fromToken),
      toToken: getAddress(payload.toToken),
      receiver: getAddress(payload.receiver),
      amount: toBigInt(payload.amount),
      fxRate: toBigInt(fxRate),
      deadline: toBigInt(deadline),
    } as const;

    const verifyingContract = FX_SWAP_MODULE_CONTRACT_ADDRESS[payload.chainId];
    if (!verifyingContract) {
      throw new Error(
        `FXSwapModule contract not found for chain ${payload.chainId}`,
      );
    }

    const signature = await this.account?.signTypedData?.({
      domain: {
        name: "FxSwapModule",
        version: "1.0.0",
        chainId: payload.chainId,
        verifyingContract: getAddress(verifyingContract),
      },
      types,
      primaryType: "swap",
      message,
    });

    if (!signature) {
      throw new Error("Failed to sign quote");
    }

    return signature;
  }
}
