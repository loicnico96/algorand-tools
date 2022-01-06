import algosdk from "algosdk"
import { PageLayout } from "components/Layout/PageLayout"
import { Link } from "components/Primitives/Link"
import { useNetworkContext } from "context/NetworkContext"
import { useWalletConnectContext } from "context/WalletConnectContext"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { api, indexer, network } = useNetworkContext()
  const { accounts, isConnected, isLoading, connect, disconnect, sign } =
    useWalletConnectContext()

  const [data, setData] = useState<{ account: { address: string } }>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (algosdk.isValidAddress(accounts[0])) {
      setData(undefined)
      setError(undefined)
      indexer
        .lookupAccountByID(accounts[0])
        .do()
        .then(data => {
          setData(data as { account: { address: string } })
          setError(undefined)
        })
        .catch(error => {
          setError(error)
        })
    } else {
      setError(Error("Invalid address"))
    }
  }, [accounts])

  const sendTransaction = async () => {
    if (algosdk.isValidAddress(accounts[0])) {
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        amount: 1000,
        from: accounts[0],
        suggestedParams: await api.getTransactionParams().do(),
        to: accounts[0],
      })

      const signed = await sign(txn)

      const result = await api.sendRawTransaction(signed).do()

      console.log("Result", result)
    }
  }

  return (
    <PageLayout>
      <div>You are on {network}.</div>
      <div>
        <button
          disabled={isLoading}
          onClick={isConnected ? disconnect : connect}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
        {isConnected && (
          <button onClick={sendTransaction}>Send transaction</button>
        )}
      </div>
      <div>Address: {accounts[0] ?? "-"}</div>
      <div>
        {error
          ? error.message
          : data
          ? JSON.stringify(data, undefined, 2)
          : "Loading..."}
      </div>
      <div>
        <Link href="https://github.com/loicnico96/algorand-tools">
          View on GitHub
        </Link>
      </div>
    </PageLayout>
  )
}
