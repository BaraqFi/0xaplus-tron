// wallets/tronlink-wallet.ts

export interface TronLinkConnection {
  address: string
  success: boolean
  error?: string
}

export class TronLinkConnector {
  private static instance: TronLinkConnector

  static getInstance(): TronLinkConnector {
    if (!TronLinkConnector.instance) {
      TronLinkConnector.instance = new TronLinkConnector()
    }
    return TronLinkConnector.instance
  }

  async connect(): Promise<TronLinkConnection> {
    try {
      const tronWeb = await this.waitForTronWeb()

      if (!tronWeb || !tronWeb.defaultAddress.base58) {
        throw new Error("TronLink not detected or not unlocked")
      }

      const address = tronWeb.defaultAddress.base58
      return { address, success: true }
    } catch (err: any) {
      return {
        address: "",
        success: false,
        error: err.message || "Failed to connect TronLink",
      }
    }
  }

  private async waitForTronWeb(maxAttempts = 30): Promise<any> {
    let attempts = 0
    while (!window.tronWeb && attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 100))
      attempts++
    }
    return window.tronWeb
  }
}
