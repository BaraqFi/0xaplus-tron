import { WalletConnectWallet, WalletConnectChainID } from "@tronweb3/walletconnect-tron"

export const wallet = new WalletConnectWallet({
  network: WalletConnectChainID.Mainnet, // use WalletConnectChainID.Nile for testnet
  options: {
    relayUrl: "wss://relay.walletconnect.com",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!, // Set this in your .env
    metadata: {
      name: "Casino Mon",
      description: "TRON-based Trust",
      url: "https://your-dapp-url.vercel.app",
      icons: ["https://your-dapp-url.vercel.app/logo.png"],
    },
  },
  web3ModalConfig: {
    themeMode: "dark",
    explorerRecommendedWalletIds: [
      "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
    ],
  },
})
