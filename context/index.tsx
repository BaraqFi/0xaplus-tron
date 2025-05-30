'use client'

import { projectId, wagmiAdapter } from "@/config"
import { createAppKit } from "@reown/appkit"
import { mainnet, bsc } from "@reown/appkit/networks"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { type ReactNode } from "react"
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi"

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error("No ProjectID Defined")
}

const metadata = {
  name: "reownWallet",
  description: "Testing the Reown Wallet Functionality",
  url: "https://examplereown.com",
}

const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, bsc],
  defaultNetwork: mainnet, // 👈 Default to Ethereum
  themeMode: "dark",
})

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
