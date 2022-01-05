import algosdk from "algosdk"
import config from "config/network.json"
import { createContext, useContext } from "react"

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
}

export interface NetworkContextValue {
  api: algosdk.Algodv2
  config: NetworkConfig
  indexer: algosdk.Indexer
}

export const NetworkContext = createContext<NetworkContextValue>({
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
})

export function useNetworkContext(): NetworkContextValue {
  return useContext(NetworkContext)
}
