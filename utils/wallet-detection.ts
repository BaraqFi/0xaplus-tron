export type WalletType =  "SafePal" | "Unknown"

export const detectWalletEnvironment = (): WalletType => {
  if (typeof window === "undefined") return "Unknown"

  const userAgent = navigator.userAgent.toLowerCase()

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
    if ((window.tronWeb as any).isSafePal) return "SafePal"
  }

  return "Unknown"
}

export function getWalletDisplayName(wallet: WalletType): string {
  switch (wallet) {
    case "SafePal":
      return "SafePal Wallet"
    default:
      return "Tron Wallet"
  }
}

export const getWalletInstructions = (walletType: WalletType): string => {
  switch (walletType) {
    case "SafePal":
      return "Please make sure you're using SafePal's DApp browser and refresh the page."
    default:
      return "Please make sure you're using SafePal's DApp browser and refresh the page."
  }
}
