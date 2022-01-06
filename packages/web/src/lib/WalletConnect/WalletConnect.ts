import QRCodeModal from "algorand-walletconnect-qrcode-modal"
import WalletConnect from "@walletconnect/client"
import algosdk from "algosdk"
import { formatJsonRpcRequest } from "@json-rpc-tools/utils"

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org",
  qrcodeModal: QRCodeModal,
})

export function isConnected(): boolean {
  return connector.connected
}

export function startWalletConnectSession(api: algosdk.Algodv2): WalletConnect {
  if (!connector.connected) {
    connector.createSession()
  }

  connector.on("connect", async (error, payload) => {
    if (error) {
      throw error
    }

    const { accounts } = payload.params[0]
    console.log("[WalletConnect] Connected with accounts:", accounts)

    const account = accounts[0]
    const params = await api.getTransactionParams().do()

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      amount: 0,
      from: account,
      suggestedParams: params,
      to: account,
    })

    console.log("[WalletConnect] Transaction to sign:", txn)

    const signedTxn = await signWalletConnectTransactions(connector, txn)
    const result = await api.sendRawTransaction(signedTxn).do()

    console.log("[WalletConnect] Signed transactions:", result)
  })

  connector.on("disconnect", error => {
    if (error) {
      throw error
    }

    console.log("[WalletConnect] Disconnected")
  })

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error
    }

    const { accounts } = payload.params[0]
    console.log("[WalletConnect] Updated with accounts:", accounts)
  })

  return connector
}

export function closeWalletConnectSession(connector: WalletConnect): void {
  if (connector.connected) {
    connector.killSession()
  }
}

export async function signWalletConnectTransactions(
  connector: WalletConnect,
  ...txns: algosdk.Transaction[]
) {
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
  const result: (string | null)[] = await connector.sendCustomRequest(request)
  return result.map(element => {
    if (!element) {
      throw Error("No response")
    }

    return Uint8Array.from(Buffer.from(element, "base64"))
  })
}
