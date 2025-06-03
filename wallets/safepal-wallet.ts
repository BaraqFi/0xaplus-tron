// wallets/safepal-wallet.ts
import { TRON_NETWORKS, TARGET_NETWORK } from "../utils/tron-config";

// Standardized connection interface
export interface WalletConnection {
  success: boolean;
  address?: string;
  error?: string;
}

export class SafePalConnector {
  private static instance: SafePalConnector | null = null;

  private constructor() {}

  static getInstance(): SafePalConnector {
    if (!SafePalConnector.instance) {
      SafePalConnector.instance = new SafePalConnector();
    }
    return SafePalConnector.instance;
  }

  async connect(): Promise<WalletConnection> {
    try {
      const tronWeb = await this.waitForTronWeb();
      if (!tronWeb) {
        throw new Error(
          "TronWeb not detected. Please use SafePal's DApp browser, then refresh the page."
        );
      }

      await this.ensureCorrectNetwork();

      const address = await this.getWalletAddress();
      if (!address) {
        throw new Error("No wallet address found. Please unlock your SafePal wallet.");
      }

      console.log("Connected to SafePal:", address);
      return { success: true, address };
    } catch (error: any) {
      console.error("SafePal connection error:", error);
      return {
        success: false,
        error: error.message || "Failed to connect SafePal",
      };
    }
  }

  private async waitForTronWeb(maxAttempts = 50): Promise<any> {
    let attempts = 0;
    while (!window.tronWeb && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
    return window.tronWeb;
  }

  private async ensureCorrectNetwork(): Promise<void> {
    if (!window.tronWeb) return;

    const currentNetwork = this.getCurrentNetwork();
    if (!currentNetwork || currentNetwork.fullHost !== TARGET_NETWORK.fullHost) {
      throw new Error(`Please manually switch to ${TARGET_NETWORK.name} (${TARGET_NETWORK.fullHost}) in SafePal settings`);
    }
  }

  private getCurrentNetwork() {
    if (!window.tronWeb) return null;

    try {
      const fullHost = window.tronWeb.fullHost || window.tronWeb.fullNode?.host;
      if (fullHost?.includes("api.trongrid.io")) {
        return TRON_NETWORKS.mainnet;
      } else if (fullHost?.includes("nile.trongrid.io")) {
        return TRON_NETWORKS.testnet;
      }
      return null;
    } catch (error) {
      console.error("Error detecting network:", error);
      return null;
    }
  }

  private async getWalletAddress(): Promise<string | null> {
    if (!window.tronWeb) return null;

    let address = window.tronWeb.defaultAddress?.base58;
    if (!address && window.tronWeb.request) {
      try {
        await window.tronWeb.request({ method: "tron_requestAccounts" });
        address = window.tronWeb.defaultAddress?.base58;
      } catch (error) {
        console.log("Request accounts failed:", error);
      }
    }
    return address || null;
  }
}