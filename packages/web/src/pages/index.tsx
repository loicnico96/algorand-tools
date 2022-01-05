import { PageLayout } from "components/Layout/PageLayout"
import { Link } from "components/Primitives/Link"
import { useNetworkContext } from "context/NetworkContext"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { api } = useNetworkContext()

  const [data, setData] = useState<unknown>()

  useEffect(() => {
    api
      .getTransactionParams()
      .do()
      .then(params => {
        setData(params)
      })
      .catch(error => {
        setData(error)
      })
  }, [api])

  return (
    <PageLayout>
      <div>You are on Mainnet.</div>
      <div>{data ? JSON.stringify(data, undefined, 2) : "Loading..."}</div>
      <div>
        <Link href="https://github.com/loicnico96/algorand-tools">
          View on GitHub
        </Link>
      </div>
    </PageLayout>
  )
}
