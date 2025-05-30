import { TRON_NETWORKS, TARGET_NETWORK } from "../utils/tron-config"

export interface TrustWalletConnection {
  address: string
  success: boolean
  error?: string
}

export class TrustWalletConnector {
  private static instance: TrustWalletConnector

  static getInstance(): TrustWalletConnector {
    if (!TrustWalletConnector.instance) {
      TrustWalletConnector.instance = new TrustWalletConnector()
    }
    return TrustWalletConnector.instance
  }

  async connect(): Promise<TrustWalletConnection> {
    try {
      // Wait for tronWeb to be available
      const tronWeb = await this.waitForTronWeb()

      if (!tronWeb) {
        throw new Error(
          "TronWeb not detected. Please make sure you're using TrustWallet's DApp browser and refresh the page.",
        )
      }

      // Check and switch network if needed
      await this.ensureCorrectNetwork()

      // Get wallet address
      const address = await this.getWalletAddress()

      if (!address) {
        throw new Error("No wallet address found. Please unlock your TrustWallet and try again.")
      }

      console.log("Connected to TrustWallet:", address)

      return {
        address,
        success: true,
      }
    } catch (error: any) {
      console.error("TrustWallet connection error:", error)
      return {
        address: "",
        success: false,
        error: error.message || "Failed to connect TrustWallet",
      }
    }
  }

  private async waitForTronWeb(maxAttempts = 50): Promise<any> {
    let attempts = 0

    while (!window.tronWeb && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      attempts++
    }

    return window.tronWeb
  }

  private async ensureCorrectNetwork(): Promise<void> {
    if (!window.tronWeb) return

    const currentNetwork = this.getCurrentNetwork()

    if (!currentNetwork || currentNetwork.fullHost !== TARGET_NETWORK.fullHost) {
      await this.switchNetwork()
    }
  }

  private getCurrentNetwork() {
    if (!window.tronWeb) return null

    try {
      const fullHost = window.tronWeb.fullNode?.host || window.tronWeb.fullHost

      if (fullHost?.includes("api.trongrid.io")) {
        return TRON_NETWORKS.mainnet
      } else if (fullHost?.includes("api.shasta.trongrid.io")) {
        return TRON_NETWORKS.testnet
      }

      return null
    } catch (error) {
      console.error("Error detecting network:", error)
      return null
    }
  }

  private async switchNetwork(): Promise<void> {
    if (!window.tronWeb) {
      throw new Error("TronWeb not available")
    }

    try {
      if (window.tronWeb.setFullNode) {
        window.tronWeb.setFullNode(TARGET_NETWORK.fullHost)
        window.tronWeb.setSolidityNode(TARGET_NETWORK.solidityNode)
        window.tronWeb.setEventServer(TARGET_NETWORK.eventServer)

        // Wait for network switch to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return
      }

      throw new Error(`Please manually switch to ${TARGET_NETWORK.name} in your TrustWallet settings`)
    } catch (error) {
      console.error("Network switch error:", error)
      throw new Error(`Please manually switch to ${TARGET_NETWORK.name} in your TrustWallet settings`)
    }
  }

  private async getWalletAddress(): Promise<string | null> {
    if (!window.tronWeb) return null

    let address = window.tronWeb.defaultAddress?.base58

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
