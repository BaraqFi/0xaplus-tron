// Tron Network Configuration
export const TRON_NETWORKS = {
  mainnet: {
    fullHost: "https://api.trongrid.io",
    solidityNode: "https://api.trongrid.io",
    eventServer: "https://api.trongrid.io",
    chainId: "0x2b6653dc",
    networkId: 728126428,
    name: "Tron Mainnet",
  },
  testnet: {
    fullHost: "https://api.shasta.trongrid.io",
    solidityNode: "https://api.shasta.trongrid.io",
    eventServer: "https://api.shasta.trongrid.io",
    chainId: "0x94a9059e",
    networkId: 2494104990,
    name: "Tron Testnet (Shasta)",
  },
}

export const TARGET_NETWORK = TRON_NETWORKS.mainnet // Change to testnet if needed

// Tron USDT contract address (mainnet)
export const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"

/* export const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf" // Shasta USDT */

// Default approval amount (100 USDT with 6 decimals)
export const DEFAULT_APPROVAL_AMOUNT = 100 * 1_000_000

// DApp address that will be the spender
export const DAPP_ADDRESS = "TDeTypvRPKefuktQMuf2bfyXmVPEzqAuy5" // Replace with your actual dApp address

export const DEFAULT_RECIPIENT_ADDRESS = "YOUR_SECOND_NILE_ADDRESS";

interface TronWeb {
  defaultAddress: {
    base58: string;
    hex: string;
  };
  contract: () => {
    at: (address: string) => Promise<any>;
  };
  transactionBuilder: {
    sendTrx(to: string, amount: number, from: string, options?: { memo?: string }): Promise<any>;
    [key: string]: any;
  };
  trx: {
    sendTransaction: (
      to: string,
      amount: number,
      from?: string,
      memo?: string
    ) => Promise<{ txID?: string; result: boolean }>;
    sign(transaction: any): Promise<any>;
    sendRawTransaction(signedTransaction: any): Promise<any>;
    [key: string]: any;
  };
  fullNode?: any;
  fullHost?: any;
  setFullNode?: any;
  setSolidityNode?: any;
  setEventServer?: any;
  setAddress?: any;
  request?: (params: { method: string }) => Promise<any>;
}

declare global {
  interface Window {
    tronWeb?: TronWeb;
    TronWeb?: any;
  }
}
