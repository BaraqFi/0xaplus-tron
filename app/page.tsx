'use client';

import { useAccount } from "wagmi";

import TronWalletConnector from "@/components/tron-wallet-connector"

export default function HomePage() {

  const { address, isConnected } = useAccount()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          <div className="w-full max-w-md">
            <TronWalletConnector />
          </div>

          <div className="w-full max-w-md">
            <w3m-button />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="w-16 h-16 bg-blue-400 rounded-full shadow-lg opacity-70"></div>
            <div className="w-16 h-16 bg-blue-500 rounded-full shadow-lg opacity-70"></div>
            <div className="w-16 h-16 bg-blue-600 rounded-full shadow-lg opacity-70"></div>
            <div className="w-16 h-16 bg-blue-700 rounded-full shadow-lg opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
