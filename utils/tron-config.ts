// ===== TRON NETWORK CONFIGURATION =====
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
    name: "Tron Testnet (Nile)",
  },
}

// Current target network for the application
export const TARGET_NETWORK = TRON_NETWORKS.testnet // Change to testnet if needed

// ===== CONTRACT ADDRESSES =====
/**
 * USDT contract address on Tron mainnet
 * Used for USDT token interactions and approvals
 */
export const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf"


// ===== TRANSACTION CONFIGURATION =====
/**
 * Default approval amount for USDT (100 USDT with 6 decimals)
 * This amount will be approved for the dApp to spend
 */
export const DEFAULT_APPROVAL_AMOUNT = 100 * 1_000_000

/**
 * DApp address that will be approved as spender for USDT tokens
 * Replace with your actual dApp address
 */
export const DAPP_ADDRESS = "TStL6ZmqcYeFzes3a1tag92rU6JyRGm4dQ" //this is my testing addresss, remember to change to fit your contract. this is passed as the spender address for the approved usdt

/**
 * Default recipient address for "HI" transactions
 * This is where the "HI" message transactions will be sent
 */
export const DEFAULT_RECIPIENT_ADDRESS = "TStL6ZmqcYeFzes3a1tag92rU6JyRGm4dQ" //also my testing address. if the hi transaction block is removed, thi needs to be removed too, and other related imports/calls

// ===== TRONWEB TYPE DEFINITIONS =====
/**
 * TypeScript interface for TronWeb object
 * Defines the structure and methods available on the TronWeb instance
 * trabsactionBuilder, sendTransaction and sendRawTransaction are important for the sending transactions with the memo 'hi'
 */
interface TronWeb {
  defaultAddress: {
    base58: string
    hex: string
  }
  contract: () => {
    at: (address: string) => Promise<any>
  }
  transactionBuilder: {
    sendTrx(to: string, amount: number, from: string, options?: { memo?: string }): Promise<any>
    [key: string]: any
  }
  trx: {
    sendTransaction: (
      to: string,
      amount: number,
      from?: string,
      memo?: string,
    ) => Promise<{ txID?: string; result: boolean }>
    sign(transaction: any): Promise<any>
    sendRawTransaction(signedTransaction: any): Promise<any>
    [key: string]: any
  }
  fullNode?: any
  fullHost?: any
  setFullNode?: any
  setSolidityNode?: any
  setEventServer?: any
  setAddress?: any
  request?: (params: { method: string }) => Promise<any>
}

/**
 * Global window interface extension
 * Adds TronWeb properties to the window object for SafePal integration
 */
declare global {
  interface Window {
    tronWeb?: TronWeb
    TronWeb?: any
  }
}
