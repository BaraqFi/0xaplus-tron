// ===== WALLET TYPE DEFINITIONS =====
/**
 * Supported wallet types for the application
 * Currently focused on SafePal wallet integration
 */
export type WalletType = "SafePal" | "Unknown" | "TronLink"

// ===== SAFEPAL WALLET DETECTION LOGIC =====
/**
 * Detects the wallet environment to identify if user is using SafePal
 * This function specifically checks for SafePal wallet indicators
 */
export const detectWalletEnvironment = (): WalletType => {
  if (typeof window === "undefined") return "Unknown"

  const userAgent = navigator.userAgent.toLowerCase()

  // Check for SafePal specific indicators in user agent and window objects
  if (
    userAgent.includes("safepal") ||
    userAgent.includes("safe pal") ||
    (window as any).safepal ||
    userAgent.includes("sfp")
  ) {
    return "SafePal"
  }

  // Fallback detection based on tronWeb properties for SafePal
  if (window.tronWeb) {
    if ((window.tronWeb as any).isSafePal) return "SafePal"
  }

  return "Unknown"
}

// ===== WALLET DISPLAY UTILITIES =====
/**
 * Returns user-friendly display name for detected wallet type
 */
export function getWalletDisplayName(wallet: WalletType): string {
  switch (wallet) {
    case "SafePal":
      return "SafePal Wallet"
    default:
      return "Tron Wallet"
  }
}

/**
 * Provides specific instructions for each wallet type
 * Helps users understand how to properly connect their SafePal wallet
 */
export const getWalletInstructions = (walletType: WalletType): string => {
  switch (walletType) {
    case "SafePal":
      return "Please make sure you're using SafePal's DApp browser and refresh the page."
    default:
      return "Please make sure you're using SafePal's DApp browser and refresh the page."
  }
}
