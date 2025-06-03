// wallets/tronlink-connector.ts
import { WalletConnection } from "./safepal-wallet";

export class TronLinkConnector {
  private static instance: TronLinkConnector | null = null;

  private constructor() {}

  public static getInstance(): TronLinkConnector {
    if (!TronLinkConnector.instance) {
      TronLinkConnector.instance = new TronLinkConnector();
    }
    return TronLinkConnector.instance;
  }

  public async connect(): Promise<WalletConnection> {
    try {
      if (!window.tronWeb) {
        return { success: false, error: "TronLink not detected. Please install TronLink extension." };
      }

      const isReady = await new Promise<boolean>((resolve) => {
        if (window.tronWeb?.ready) {
          resolve(true);
        } else {
          window.addEventListener("tronLink#initialized", () => resolve(true), { once: true });
          setTimeout(() => resolve(false), 1000);
        }
      });

      if (!isReady || !window.tronWeb?.defaultAddress.base58) {
        return { success: false, error: "Please unlock TronLink and select a TRON account." };
      }

      const address = window.tronWeb.defaultAddress.base58;
      return { success: true, address };
    } catch (error: any) {
      console.error("TronLink connection error:", error);
      return { success: false, error: error.message || "Failed to connect to TronLink" };
    }
  }
}