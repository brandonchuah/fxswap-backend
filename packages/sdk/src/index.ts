import { BrokerRequest, BrokerResponse } from "@fxswap/interfaces";
import axios, { AxiosInstance } from "axios";

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
}
