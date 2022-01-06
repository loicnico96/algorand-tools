import algosdk from "algosdk"
import { PageLayout } from "components/Layout/PageLayout"
import { Link } from "components/Primitives/Link"
import { useNetworkContext } from "context/NetworkContext"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { indexer } = useNetworkContext()

  const [address, setAddress] = useState("")
  const [data, setData] = useState<unknown>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (algosdk.isValidAddress(address)) {
      setData(undefined)
      setError(undefined)
      indexer
        .lookupAccountByID(address)
        .do()
        .then(params => {
          setData(params)
          setError(undefined)
        })
        .catch(error => {
          setError(error)
        })
    } else {
      setError(Error("Invalid address"))
    }
  }, [address, indexer])

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
        <Link href="https://github.com/loicnico96/algorand-tools">
          View on GitHub
        </Link>
      </div>
    </PageLayout>
  )
}
