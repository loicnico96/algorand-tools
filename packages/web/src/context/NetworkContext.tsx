import algosdk from "algosdk"
import networks from "config/networks.json"
import { createContext, useContext, useState } from "react"
import { ProviderProps } from "./types"

export interface NetworkConfig {
  algo_api: {
    port: string
    token: string
    url: string
  }
  algo_explorer: {
    url: string
  }
  algo_indexer: {
    port: string
    token: string
    url: string
  }
  walletconnect: {
    bridge: string
  }
}

export enum Network {
  MAIN = "mainnet",
  TEST = "testnet",
}

export interface NetworkContextValue {
  api: algosdk.Algodv2
  config: NetworkConfig
  indexer: algosdk.Indexer
  network: Network
  setNetwork: (network: Network) => void
}

export const DEFAULT_NETWORK = Network.MAIN

export const NetworkContext = createContext({} as NetworkContextValue)

export function NetworkContextProvider({ children }: ProviderProps) {
  const [network, setNetwork] = useState(DEFAULT_NETWORK)

  const config: NetworkConfig = networks[network]

  const contextValue = {
    api: new algosdk.Algodv2(
      config.algo_api.token,
      config.algo_api.url,
      config.algo_api.port
    ),
    config,
    indexer: new algosdk.Indexer(
      config.algo_indexer.token,
      config.algo_indexer.url,
      config.algo_indexer.port
    ),
    network,
    setNetwork,
  }

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetworkContext(): NetworkContextValue {
  return useContext(NetworkContext)
}
