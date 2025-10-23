import { Address } from "viem";
import { sepolia } from "viem/chains";

export const FX_RATE_DECIMALS = 18;

export const DEFAULT_FX_RATES: Record<string, Record<string, number>> = {
  USD: {
    SGD: 1.35,
  },
  SGD: {
    USD: 0.74,
  },
};

export const SUPPORTED_CURRENCIES = Object.keys(DEFAULT_FX_RATES);

export const PYUSD_CONTRACT_ADDRESS = {
  sepolia: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
};

// MockXSGD contract address
export const XSGD_CONTRACT_ADDRESS = {
  sepolia: "0x8a0c939571ef36363a5b4526a28ac59f623ebf97",
};

export const getCurrencyFromTokenAddress = (
  tokenAddress: Address,
  chainId: number,
) => {
  if (chainId === sepolia.id) {
    if (tokenAddress === PYUSD_CONTRACT_ADDRESS.sepolia) {
      return "USD";
    }
    if (tokenAddress === XSGD_CONTRACT_ADDRESS.sepolia) {
      return "SGD";
    }
  }

  throw new Error(`Unsupported token on chain ${chainId}: ${tokenAddress}`);
};
