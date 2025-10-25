export const FX_SWAP_MODULE_ABI = [
  {
    type: "function",
    name: "swap",
    stateMutability: "nonpayable",
    inputs: [
      { name: "fromToken", type: "address" },
      { name: "toToken", type: "address" },
      { name: "receiver", type: "address" },
      {
        name: "brokerParams",
        type: "tuple[]",
        components: [
          { name: "broker", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "fxRate", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
    outputs: [],
  },
] as const;
