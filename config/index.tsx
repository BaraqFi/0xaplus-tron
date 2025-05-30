import { cookieStorage, createStorage } from "wagmi"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { mainnet, bsc, tron } from "@reown/appkit/networks"

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
    throw new Error('No Project ID defined.')
}

export const networks = [mainnet, bsc, tron]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    networks,
    projectId,
})

export const config = wagmiAdapter.wagmiConfig
