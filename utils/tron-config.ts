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

export const TARGET_NETWORK = TRON_NETWORKS.testnet // Change to testnet if needed

// Tron USDT contract address (mainnet)
/* export const USDT_CONTRACT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj" */

export const USDT_CONTRACT = "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf" // Shasta USDT

// Default approval amount (100 USDT with 6 decimals)
export const DEFAULT_APPROVAL_AMOUNT = 100 * 1_000_000

// DApp address that will be the spender
export const DAPP_ADDRESS = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE" // Replace with your actual dApp address

interface TronWeb {
  defaultAddress: {
    base58: string
  }
  contract: () => {
    at: (address: string) => Promise<any>
  }
  fullNode?: any
  fullHost?: any
  setFullNode?: any
  setSolidityNode?: any
  setEventServer?: any
  setAddress?: any
  request?: (params: { method: string }) => Promise<any>
}

declare global {
  interface Window {
    tronWeb?: TronWeb
    TronWeb?: any
  }
}
