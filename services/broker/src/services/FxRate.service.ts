import { configs } from "@fxswap/configs";
import {
  DEFAULT_FX_RATES,
  FX_RATE_DECIMALS,
  getCurrencyFromTokenAddress,
  SUPPORTED_CURRENCIES,
} from "@fxswap/constants";
import axios from "axios";
import { Address, parseUnits } from "viem";

/**
 * This service is used to determine the exchange rate brokers want to quote.
 * In this example, we are simply using the exchange rate API to get the rate.
 * Brokers can implement their own logic to get the rate.
 */
export class FxRateService {
  private static instance: FxRateService | undefined;
  private readonly baseUrl = "https://api.fastforex.io";
  private readonly apiKey: string;

  private constructor() {
    this.apiKey = configs.fastForexApiKey;
  }

  static getInstance(): FxRateService {
    if (!this.instance) {
      this.instance = new FxRateService();
    }
    return this.instance;
  }

  public async getRateFromTokenAddresses(
    fromToken: Address,
    toToken: Address,
    fromChainId: number,
    toChainId: number,
  ): Promise<string> {
    try {
      const fromCurrency = getCurrencyFromTokenAddress(fromToken, fromChainId);
      const toCurrency = getCurrencyFromTokenAddress(toToken, toChainId);
      return this.getRate(fromCurrency, toCurrency);
    } catch (error: any) {
      throw new Error(
        `Failed to get rate from token addresses: ${error.message ?? error}`,
      );
    }
  }

  public async getRate(from: string, to: string): Promise<string> {
    try {
      if (!this.isSupportedCurrency(from) || !this.isSupportedCurrency(to)) {
        throw new Error(`Unsupported currency: ${from} or ${to}`);
      }

      if (!this.apiKey) {
        const rate = DEFAULT_FX_RATES?.[from]?.[to];
        if (!rate) {
          throw new Error(`Unsupported rate: ${from} to ${to}`);
        }
        return parseUnits(rate.toString(), FX_RATE_DECIMALS).toString();
      }

      const response = await axios.get(`${this.baseUrl}/fetch-one`, {
        headers: {
          "X-API-Key": this.apiKey,
        },
        params: {
          from,
          to,
        },
      });

      const rate = response.data?.result?.[to] as unknown as number;

      if (rate) {
        return parseUnits(rate.toString(), FX_RATE_DECIMALS).toString();
      } else {
        throw new Error(`Unsupported rate: ${from} to ${to}`);
      }
    } catch (error: any) {
      console.error("Error fetching FX rate:", error.message ?? error);
      throw new Error("Failed to fetch exchange rate");
    }
  }

  private isSupportedCurrency(currency: string): boolean {
    return SUPPORTED_CURRENCIES.includes(currency);
  }
}
