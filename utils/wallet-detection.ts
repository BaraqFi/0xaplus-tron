export type WalletType = "TrustWallet" | "SafePal" | "Unknown"

export const detectWalletEnvironment = (): WalletType => {
  if (typeof window === "undefined") return "Unknown"

  const userAgent = navigator.userAgent.toLowerCase()

  // Check for TrustWallet specific indicators
  if (
    userAgent.includes("trustwallet") ||
    userAgent.includes("trust wallet") ||
    (window as any).trustwallet ||
    userAgent.includes("trust")
  ) {
    return "TrustWallet"
  }

  // Check for SafePal specific indicators
  if (
    userAgent.includes("safepal") ||
    userAgent.includes("safe pal") ||
    (window as any).safepal ||
    userAgent.includes("sfp")
  ) {
    return "SafePal"
  }

  // Fallback detection based on tronWeb properties
  if (window.tronWeb) {
    // Some wallets might have specific properties
    if ((window.tronWeb as any).isTrustWallet) return "TrustWallet"
    if ((window.tronWeb as any).isSafePal) return "SafePal"
  }

  return "Unknown"
}

export const getWalletDisplayName = (walletType: WalletType): string => {
  switch (walletType) {
    case "TrustWallet":
      return "TrustWallet"
    case "SafePal":
      return "SafePal"
    default:
      return "Trust/SafePal"
  }
}

export const getWalletInstructions = (walletType: WalletType): string => {
  switch (walletType) {
    case "TrustWallet":
      return "Please make sure you're using TrustWallet's DApp browser and refresh the page."
    case "SafePal":
      return "Please make sure you're using SafePal's DApp browser and refresh the page."
    default:
      return "Please make sure you're using TrustWallet or SafePal's DApp browser and refresh the page."
  }
}
