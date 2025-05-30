"use client"

import { useSwitchNetwork, useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { w3mButton } from "@reown/appkit"

export default function EvmWalletConnector() {
  const { switchNetwork } = useSwitchNetwork()
  const { address, isConnected } = useAccount()

  const handleConnect = (chainId: number) => {
    switchNetwork?.(chainId)
    const btn = document.getElementById("w3m-connect-btn")
    btn?.click()
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-6xl font-bold text-yellow-400 drop-shadow-lg mb-6">EVM Wallet</h1>

        <div className="flex gap-4">
          <Button
            onClick={() => handleConnect(56)} // BSC
            className="flex-1 h-12 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg"
          >
            BSC
          </Button>

          <Button
            onClick={() => handleConnect(1)} // Ethereum
            className="flex-1 h-12 text-lg font-semibold bg-gray-400 hover:bg-gray-500 text-white shadow-lg"
          >
            ETH
          </Button>
        </div>

        {/* Hidden Reown trigger */}
        <div className="hidden">
          <w3mButton id="w3m-connect-btn" />
        </div>

        {isConnected && (
          <p className="text-sm text-gray-300 mt-4 break-all">Connected EVM Wallet: {address}</p>
        )}
      </div>
    </div>
  )
}
