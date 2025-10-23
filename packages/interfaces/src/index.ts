import { Address, Hex } from "viem";

export interface BrokerRequest {
  chainId: number;
  fromToken: Address;
  toToken: Address;
  receiver: Address;
  amount: string;
}

export interface BrokerResponse extends BrokerRequest {
  brokerAddress: Address;
  fxRate: string;
  deadline: string;
  signature: Hex;
}
