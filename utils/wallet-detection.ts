// utils/wallet-detection.ts
/**
 * Supported wallet types for the application
 */
export type WalletType = "SafePal" | "TronLink" | "Unknown";

/**
 * Detects the wallet environment to identify if user is using SafePal or TronLink
 */
export const detectWalletEnvironment = (): WalletType => {
  if (typeof window === "undefined") return "Unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  // SafePal detection
  if (
    userAgent.includes("safepal") ||
    userAgent.includes("safe pal") ||
    window.safepal ||
    userAgent.includes("sfp") ||
    (window.tronWeb && window.tronWeb.isSafePal)
  ) {
    return "SafePal";
  }

  // TronLink detection
  if (window.tronWeb && window.tronWeb.ready && !window.tronWeb.isSafePal) {
    return "TronLink";
  }

  return "Unknown";
};

/**
 * Returns user-friendly display name for detected wallet type
 */
export function getWalletDisplayName(wallet: WalletType): string {
  switch (wallet) {
    case "SafePal":
      return "SafePal Wallet";
    case "TronLink":
      return "TronLink Wallet";
    default:
      return "Tron Wallet";
  }
}

/**
 * Provides specific instructions for each wallet type
 */
export const getWalletInstructions = (walletType: WalletType): string => {
  switch (walletType) {
    case "SafePal":
      return "Please use SafePal's DApp browser and ensure you're on the Tron Testnet (Nile).";
    case "TronLink":
      return "Please install the TronLink browser extension and ensure you're on the Tron Testnet (Nile).";
    default:
      return "Please use SafePal's DApp browser or TronLink extension and switch to the Tron Testnet (Nile).";
  }
};