import { FX_SWAP_MODULE_CONTRACT_ADDRESS } from "@fxswap/constants";
import { BrokerRequest, BrokerResponse } from "@fxswap/interfaces";
import axios, { AxiosInstance } from "axios";
import {
  createPublicClient,
  erc20Abi,
  Hex,
  http,
  WalletClient,
  zeroAddress,
} from "viem";
import { FX_SWAP_MODULE_ABI } from "./abis";

export class FxSwapClient {
  private readonly http: AxiosInstance;

  constructor(baseUrl: string, timeoutMs: number = 10_000) {
    this.http = axios.create({ baseURL: baseUrl, timeout: timeoutMs });
  }

  async quote(body: BrokerRequest): Promise<{
    quote: BrokerResponse;
  }> {
    const { data } = await this.http.post("/quote", body);
    return data;
  }

  async swap(
    wallet: WalletClient,
    params: Omit<BrokerRequest, "chainId">,
  ): Promise<Hex> {
    if (!wallet.chain) {
      throw new Error("Chain not set");
    }
    const chainId = wallet.chain.id;
    const { quote } = await this.quote({ ...params, chainId });

    const fxSwapModuleAddress = FX_SWAP_MODULE_CONTRACT_ADDRESS[chainId];

    if (!fxSwapModuleAddress || fxSwapModuleAddress === zeroAddress) {
      throw new Error(`Does not support chain ${chainId}`);
    }

    const publicClient = createPublicClient({
      chain: wallet.chain,
      transport: http(),
    });

    const approveTxHash = await wallet.writeContract({
      address: quote.fromToken,
      abi: erc20Abi,
      functionName: "approve",
      chain: wallet.chain,
      args: [fxSwapModuleAddress, BigInt(quote.amount)],
      account: wallet.account!,
    });

    await publicClient.waitForTransactionReceipt({ hash: approveTxHash });

    const brokerParams = [
      {
        broker: quote.brokerAddress,
        amount: BigInt(quote.amount),
        fxRate: BigInt(quote.fxRate),
        deadline: BigInt(quote.deadline),
        signature: quote.signature,
      },
    ];

    const swapHash = await wallet.writeContract({
      address: fxSwapModuleAddress,
      abi: FX_SWAP_MODULE_ABI,
      functionName: "swap",
      chain: wallet.chain,
      args: [quote.fromToken, quote.toToken, quote.receiver, brokerParams],
      account: wallet.account!,
    });

    await publicClient.waitForTransactionReceipt({ hash: swapHash });

    return swapHash;
  }
}
