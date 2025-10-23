import {
  PYUSD_CONTRACT_ADDRESS,
  XSGD_CONTRACT_ADDRESS,
} from "@fxswap/constants";
import { polygon, sepolia } from "viem/chains";
import { beforeEach, describe, expect, it } from "vitest";
import { FxRateService } from "../src/services/FxRate.service";

describe("FxRateService", () => {
  let service: FxRateService;

  beforeEach(() => {
    service = new FxRateService();
  });

  it("returns rate from API response", async () => {
    const rate = await service.getRate("USD", "SGD");

    expect(rate).toBeDefined();
  });

  it("throws on unsupported rate", async () => {
    await expect(service.getRate("GBP", "USD")).rejects.toThrow(
      "Failed to fetch exchange rate",
    );
  });

  it("returns rate from token addresses", async () => {
    const rate = await service.getRateFromTokenAddresses(
      PYUSD_CONTRACT_ADDRESS.sepolia,
      XSGD_CONTRACT_ADDRESS.sepolia,
      sepolia.id,
      sepolia.id,
    );

    expect(rate).toBeDefined();
  });

  it("throws on unsupported token address", async () => {
    await expect(
      service.getRateFromTokenAddresses(
        "0x0000000000000000000000000000000000000000",
        XSGD_CONTRACT_ADDRESS.sepolia,
        sepolia.id,
        sepolia.id,
      ),
    ).rejects.toThrow(
      "Unsupported token on chain 11155111: 0x0000000000000000000000000000000000000000",
    );
  });

  it("thrown on unsupported chain", async () => {
    await expect(
      service.getRateFromTokenAddresses(
        PYUSD_CONTRACT_ADDRESS.sepolia,
        XSGD_CONTRACT_ADDRESS.sepolia,
        polygon.id,
        sepolia.id,
      ),
    ).rejects.toThrow(
      "Unsupported token on chain 137: " + PYUSD_CONTRACT_ADDRESS.sepolia,
    );
  });
});
