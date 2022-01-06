import algosdk from "algosdk"
import { PageLayout } from "components/Layout/PageLayout"
import { Link } from "components/Primitives/Link"
import { useNetworkContext } from "context/NetworkContext"
import { useWalletConnectContext } from "context/WalletConnectContext"
import { useAccountInfo } from "hooks/api/useAccount"
import { queryIndexer } from "lib/api/query"

export default function HomePage() {
  const { api, network } = useNetworkContext()
  const { accounts, isConnected, sign } = useWalletConnectContext()
  const { data, error } = useAccountInfo(accounts[0])

  const onSendTransaction = async (...txns: algosdk.Transaction[]) => {
    const signed = await sign(...txns)
    const result = await queryIndexer(api.sendRawTransaction(signed))
    console.log("Transaction sent", result)
  }

  const onOptOutApplication = async (appId: number, force?: boolean) => {
    const txn = force
      ? algosdk.makeApplicationClearStateTxnFromObject({
          appIndex: appId,
          from: accounts[0],
          suggestedParams: await queryIndexer(api.getTransactionParams()),
        })
      : algosdk.makeApplicationCloseOutTxnFromObject({
          appIndex: appId,
          from: accounts[0],
          suggestedParams: await queryIndexer(api.getTransactionParams()),
        })

    return onSendTransaction(txn)
  }

  const onOptOutAsset = async (assetId: number, creator: string) => {
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      amount: 0,
      assetIndex: assetId,
      closeRemainderTo: creator,
      from: accounts[0],
      suggestedParams: await queryIndexer(api.getTransactionParams()),
      to: accounts[0],
    })

    return onSendTransaction(txn)
  }

  return (
    <PageLayout>
      <div>You are on {network}.</div>
      {isConnected && (
        <div>
          {error && <div>{error.message}</div>}
          {!error && !data && <div>Loading...</div>}
          {data && (
            <div>
              <p>Address: {data.address}</p>
              <p>Amount: {(data.amount / 1e6).toFixed(6)}</p>
              <h5>Applications:</h5>
              {data.appsLocalState?.map(app => (
                <div key={app.id}>
                  <p>
                    {app.id} - {JSON.stringify(app.keyValue ?? [])}
                  </p>
                  <button onClick={() => onOptOutApplication(app.id)}>
                    Opt Out {app.id}
                  </button>
                  <button onClick={() => onOptOutApplication(app.id, true)}>
                    Opt Out {app.id} (Force)
                  </button>
                </div>
              ))}
              <h5>Assets:</h5>
              {data.assets?.map(asset => (
                <div key={asset.assetId}>
                  <p>
                    {asset.assetId} - {asset.amount}
                  </p>
                  <button
                    disabled={asset.amount > 0}
                    onClick={() => onOptOutAsset(asset.assetId, asset.creator)}
                  >
                    Opt Out {asset.assetId}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div>
        <Link href="https://github.com/loicnico96/algorand-tools">
          View on GitHub
        </Link>
      </div>
    </PageLayout>
  )
}
