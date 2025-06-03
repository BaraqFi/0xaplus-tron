import { TRON_NETWORKS, TARGET_NETWORK } from "../utils/tron-config"

// ===== SAFEPAL CONNECTION INTERFACE =====
/**
 * Interface for SafePal wallet connection results
 */
export interface SafePalConnection {
  address: string
  success: boolean
  error?: string
}

// ===== SAFEPAL WALLET CONNECTOR CLASS =====
/**
 * SafePal Wallet Connector - Singleton class for managing SafePal wallet connections
 * This class handles all SafePal-specific wallet integration logic including:
 * - Wallet detection and connection
 * - Address retrieval
 */
export class SafePalConnector {
  private static instance: SafePalConnector

  /**
   * Singleton pattern implementation for SafePal connector
   * Ensures only one instance of the connector exists
   */
  static getInstance(): SafePalConnector {
    if (!SafePalConnector.instance) {
      SafePalConnector.instance = new SafePalConnector()
    }
    return SafePalConnector.instance
  }

  // ===== MAIN SAFEPAL CONNECTION METHOD =====
  /**
   * Main method to connect to SafePal wallet
   * This is the primary SafePal integration function that:
   * 1. Waits for TronWeb to be available in SafePal
   * 2. Ensures correct network configuration
   * 3. Retrieves wallet address
   */
  async connect(): Promise<SafePalConnection> {
    try {
      // Wait for SafePal's TronWeb to be available
      const tronWeb = await this.waitForTronWeb()

      if (!tronWeb) {
        throw new Error(
          "TronWeb not detected. Please make sure you're using SafePal (mobile DApp browser or desktop extension), then refresh the page.",
        )
      }

      // Check correct Tron network
      await this.ensureCorrectNetwork()

      // Get wallet address from SafePal
      const address = await this.getWalletAddress()

      if (!address) {
        throw new Error("No wallet address found. Please unlock your SafePal wallet and try again.")
      }

      console.log("Connected to SafePal:", address)

      return {
        address,
        success: true,
      }
    } catch (error: any) {
      console.error("SafePal connection error:", error)
      return {
        address: "",
        success: false,
        error: error.message || "Failed to connect SafePal",
      }
    }
  }

  // ===== SAFEPAL TRONWEB DETECTION =====
  /**
   * Waits for SafePal's TronWeb to become available
   * SafePal injects TronWeb into the browser context, this function waits for it
   */
  private async waitForTronWeb(maxAttempts = 50): Promise<any> {
    let attempts = 0

    while (!window.tronWeb && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }

    return window.tronWeb
  }

  // ===== NETWORK MANAGEMENT FOR SAFEPAL =====
  /**
   * Ensures SafePal is connected to the correct Tron network
   * Switches network if necessary for proper dApp functionality, but switch network doesnt work so network has to be manually changed by user
   */
  private async ensureCorrectNetwork(): Promise<void> {
    if (!window.tronWeb) return

    const currentNetwork = this.getCurrentNetwork()

    if (!currentNetwork || currentNetwork.fullHost !== TARGET_NETWORK.fullHost) {
      await this.switchNetwork()
    }
  }

  /**
   * Detects the current Tron network in SafePal
   */
  private getCurrentNetwork() {
    if (!window.tronWeb) return null

    try {
      const fullHost = window.tronWeb.fullNode?.host || window.tronWeb.fullHost

      if (fullHost?.includes("api.trongrid.io")) {
        return TRON_NETWORKS.mainnet
      } else if (fullHost?.includes("https://nile.trongrid.io")) {
        return TRON_NETWORKS.testnet
      }

      return null
    } catch (error) {
      console.error("Error detecting network:", error)
      return null
    }
  }

  /**
   * Switches SafePal to the target Tron network
   * Attempts automatic switching or prompts user for manual switch
   */
  private async switchNetwork(): Promise<void> {
    if (!window.tronWeb) {
      throw new Error("TronWeb not available")
    }

    try {
      // Attempt automatic network switching in SafePal
      if (window.tronWeb.setFullNode) {
        window.tronWeb.setFullNode(TARGET_NETWORK.fullHost)
        window.tronWeb.setSolidityNode(TARGET_NETWORK.solidityNode)
        window.tronWeb.setEventServer(TARGET_NETWORK.eventServer)

        // Wait for network switch to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return
      }

      throw new Error(`Please manually switch to ${TARGET_NETWORK.name} in your SafePal settings`)
    } catch (error) {
      console.error("Network switch error:", error)
      throw new Error(`Please manually switch to ${TARGET_NETWORK.name} in your SafePal settings`)
    }
  }

  // ===== SAFEPAL ADDRESS RETRIEVAL =====
  /**
   * Retrieves the wallet address from SafePal
   * Handles both automatic detection and manual account request
   */
  private async getWalletAddress(): Promise<string | null> {
    if (!window.tronWeb) return null

    let address = window.tronWeb.defaultAddress?.base58

    // If address not immediately available, request account access from SafePal
    if (!address) {
      try {
        if (window.tronWeb.request) {
          await window.tronWeb.request({ method: "tron_requestAccounts" })
        }
        address = window.tronWeb.defaultAddress?.base58
      } catch (requestError) {
        console.log("Request accounts failed:", requestError)
      }
    }

    return address || null
  }
}
