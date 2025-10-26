import { configs } from "@fxswap/configs";
import { BrokerRequest, BrokerResponse } from "@fxswap/interfaces";
import axios from "axios";

type BrokerEndpoint = { baseUrl: string };

export class AggregatorService {
  private static instance: AggregatorService | undefined;
  private readonly endpoints: BrokerEndpoint[];

  private constructor() {
    this.endpoints = configs.brokerEndpoints
      ? configs.brokerEndpoints
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
          .map((baseUrl: string): BrokerEndpoint => ({ baseUrl }))
      : [{ baseUrl: "http://localhost:3000" }];
  }

  static getInstance(): AggregatorService {
    if (!this.instance) this.instance = new AggregatorService();
    return this.instance;
  }

  public async aggregate(
    body: BrokerRequest,
  ): Promise<{ quote: BrokerResponse }> {
    try {
      const results = await Promise.all(
        this.endpoints.map((e: BrokerEndpoint) => this.requestQuote(e, body)),
      );
      const quotes = results.filter(
        (q: BrokerResponse | null): q is BrokerResponse => q !== null,
      );
      if (quotes.length === 0) throw new Error("No quotes returned");

      // TODO: check if the broker still has liquidity on chain
      // TODO: return multiple quotes with different brokers if the best rate broker has insufficient liquidity to cover full amount
      const bestQuote = this.getBestFxRate(quotes);

      return {
        quote: bestQuote,
      };
    } catch (error: any) {
      console.error("Failed to aggregate quotes", error);
      throw new Error(`Failed to aggregate quotes: ${error.message ?? error}`);
    }
  }

  private async requestQuote(
    endpoint: BrokerEndpoint,
    body: BrokerRequest,
  ): Promise<BrokerResponse | null> {
    try {
      const { data } = await axios.post<BrokerResponse>(
        `${endpoint.baseUrl}/quote`,
        body,
        { timeout: 5000 },
      );
      return data;
    } catch {
      return null;
    }
  }

  private getBestFxRate(quotes: BrokerResponse[]): BrokerResponse {
    const sorted = [...quotes].sort((a, b) => (a.fxRate < b.fxRate ? 1 : -1));

    return sorted[0]!;
  }
}
