// utils/tron-config.ts
/**
 * Configuration for Tron blockchain networks (mainnet and testnet)
 * Contains API endpoints and network identifiers
 */
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
    fullHost: "https://nile.trongrid.io",
    solidityNode: "https://nile.trongrid.io",
    eventServer: "https://nile.trongrid.io",
    chainId: "0x4a8f2a3b",
    networkId: 123454321,
    name: "Tron Testnet (Nile)",
  },
};

export const TARGET_NETWORK = TRON_NETWORKS.testnet;
export const EXPECTED_CHAIN_ID = TARGET_NETWORK.chainId;

/**
 * USDT contract address on Tron testnet (Nile)
 */
export const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

/**
 * Default approval amount for USDT (100 USDT with 6 decimals)
 */
export const DEFAULT_APPROVAL_AMOUNT = 100 * 1_000_000;

/**
 * DApp address approved as spender for USDT tokens
 */
export const DAPP_ADDRESS = "TStL6ZmqcYeFzes3a1tag92rU6JyRGm4dQ";

/**
 * Recipient address for "HI" transactions
 * Note: Same as DAPP_ADDRESS; use a different address to avoid self-transfer issues
 */
export const DEFAULT_RECIPIENT_ADDRESS = "TStL6ZmqcYeFzes3a1tag92rU6JyRGm4dQ";

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
  fullNode?: { host?: string };
  fullHost?: string;
  setFullNode?: any;
  setSolidityNode?: any;
  setEventServer?: any;
  setAddress?: any;
  request?: (params: { method: string }) => Promise<any>;
  ready?: boolean;
  isSafePal?: boolean;
}

declare global {
  interface Window {
    tronWeb?: TronWeb;
    TronWeb?: any;
    SafePalHook?: {
      base58?: string;
      defaultAddress?: { base58: string };
      request: (params: { method: string }) => Promise<any>;
    };
    safepal?: any;
  }
}