import { useState } from "react"
import { wallet } from "@/wallets/walletconnect-tron"

export const useTronWalletConnect = () => {
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connect = async () => {
    try {
      const userAddress = await wallet.connect()
      setAddress(userAddress)
      setError(null)
    } catch (err: any) {
      console.error("WalletConnect error:", err)
      setError(err.message || "Failed to connect")
    }
  }

  const disconnect = async () => {
    await wallet.disconnect()
    setAddress(null)
    setError(null)
  }

  return { address, connect, disconnect, error }
}
