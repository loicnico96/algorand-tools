import { formatJsonRpcRequest } from "@json-rpc-tools/utils"
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "algorand-walletconnect-qrcode-modal"
import algosdk from "algosdk"
import { createContext, useContext, useEffect, useState } from "react"
import { useNetworkContext } from "./NetworkContext"
import { ProviderProps } from "./types"

export interface WalletConnectState {
  accounts: string[]
  connector: WalletConnect | undefined
  isConnected: boolean
  isLoading: boolean
}

export interface WalletConnectContextValue extends WalletConnectState {
  connect: () => void
  disconnect: () => void
  sign: (...txns: algosdk.Transaction[]) => Promise<Uint8Array[]>
}

export const WalletConnectContext = createContext(
  {} as WalletConnectContextValue
)

export function WalletConnectContextProvider({ children }: ProviderProps) {
  const [connectorState, setConnectorState] = useState<WalletConnectState>({
    accounts: [],
    connector: undefined,
    isConnected: false,
    isLoading: true,
  })

  const { config } = useNetworkContext()
  const { connector } = connectorState

  useEffect(() => {
    const connector = new WalletConnect({
      bridge: config.walletconnect.bridge,
      qrcodeModal: QRCodeModal,
    })

    setConnectorState({
      accounts: connector.accounts,
      connector,
      isConnected: connector.connected,
      isLoading: false,
    })

    connector.on("connect", (error, payload) => {
      if (error) {
        console.error("[WC] Connect", error)
      } else {
        console.log("[WC] Connect", payload)
        setConnectorState({
          accounts: payload.params[0].accounts,
          connector,
          isConnected: true,
          isLoading: false,
        })
      }
    })

    connector.on("disconnect", (error, payload) => {
      if (error) {
        console.error("[WC] Disconnect", error)
      } else {
        console.log("[WC] Disconnect", payload)
        setConnectorState({
          accounts: [],
          connector,
          isConnected: false,
          isLoading: false,
        })
      }
    })

    connector.on("session_update", (error, payload) => {
      if (error) {
        console.error("[WC] Session update", error)
      } else {
        console.log("[WC] Session update", payload)
        setConnectorState({
          accounts: payload.params[0].accounts,
          connector,
          isConnected: true,
          isLoading: false,
        })
      }
    })
  }, [config])

  const contextValue: WalletConnectContextValue = {
    ...connectorState,
    connect: () => {
      if (!connector) {
        throw Error("Not available")
      }

      connector.createSession()
    },
    disconnect: () => {
      if (!connector?.connected) {
        throw Error("Not connected")
      }

      connector.killSession()
    },
    sign: async (...txns: algosdk.Transaction[]) => {
      if (!connector?.connected) {
        throw Error("Not connected")
      }

      const txnsToSign = txns.map(txn => {
        return {
          txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString(
            "base64"
          ),
          description: "Description of transaction being signed",
        }
      })

      const requestParams = [txnsToSign]
      const request = formatJsonRpcRequest("algo_signTxn", requestParams)
      const result: string[] = await connector.sendCustomRequest(request)
      return result.map(txn => Uint8Array.from(Buffer.from(txn, "base64")))
    },
  }

  return (
    <WalletConnectContext.Provider value={contextValue}>
      {children}
    </WalletConnectContext.Provider>
  )
}

export function useWalletConnectContext(): WalletConnectContextValue {
  return useContext(WalletConnectContext)
}
