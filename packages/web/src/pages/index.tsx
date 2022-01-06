import WalletConnect from "@walletconnect/client"
import algosdk from "algosdk"
import { PageLayout } from "components/Layout/PageLayout"
import { Link } from "components/Primitives/Link"
import { useNetworkContext } from "context/NetworkContext"
import {
  closeWalletConnectSession,
  isConnected,
  startWalletConnectSession,
} from "lib/WalletConnect/WalletConnect"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { api, indexer } = useNetworkContext()

  const [address, setAddress] = useState("")
  const [data, setData] = useState<{ account: { address: string } }>()
  const [error, setError] = useState<Error>()
  const [connector, setConnector] = useState<WalletConnect>()

  useEffect(() => {
    if (algosdk.isValidAddress(address)) {
      setData(undefined)
      setError(undefined)
      indexer
        .lookupAccountByID(address)
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
  }, [address, indexer])

  const onConnect = async () => {
    setConnector(startWalletConnectSession(api))
  }

  const onDisconnect = () => {
    if (connector) {
      closeWalletConnectSession(connector)
      setConnector(undefined)
    }
  }

  return (
    <PageLayout>
      <div>You are on Mainnet.</div>
      <div>
        Address:
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <div>
        {error
          ? error.message
          : data
          ? JSON.stringify(data, undefined, 2)
          : "Loading..."}
      </div>
      <div>
        <button onClick={isConnected() ? onDisconnect : onConnect}>
          {isConnected() ? "Disconnect" : "Connect"}
        </button>
      </div>
      <div>
        <Link href="https://github.com/loicnico96/algorand-tools">
          View on GitHub
        </Link>
      </div>
    </PageLayout>
  )
}
