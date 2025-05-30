// hooks/useTronWalletConnect.ts
"use client"

import { useState, useEffect } from "react"
import { WalletConnectWallet, WalletConnectChainID } from "@tronweb3/walletconnect-tron"

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || "" // from Reown/WalletConnect

export function useTronWalletConnect() {
  const [wallet, setWallet] = useState<WalletConnectWallet | null>(null)
  const [address, setAddress] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const w = new WalletConnectWallet({
      network: WalletConnectChainID.Mainnet,
      options: {
        projectId: PROJECT_ID,
        relayUrl: "wss://relay.walletconnect.com",
        metadata: {
          name: "0xaplus-tron",
          description: "TRON dApp with WalletConnect v2",
          url: "https://0xaplus-tron.vercel.app",
          icons: ["https://0xaplus-tron.vercel.app/icon.png"],
        },
      },
    })

    setWallet(w)

    // Automatically restore connection if session exists
    w.restoreSession().then((restored) => {
      if (restored) {
        w.getAddress().then(setAddress).catch(() => {})
      }
    })

    return () => {
      w.disconnect()
    }
  }, [])

  const connect = async () => {
    if (!wallet) return
    try {
      const addr = await wallet.connect()
      setAddress(addr)
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to connect")
    }
  }

  const disconnect = async () => {
    if (!wallet) return
    await wallet.disconnect()
    setAddress("")
  }

  return {
    connect,
    disconnect,
    address,
    error,
    wallet,
  }
}
