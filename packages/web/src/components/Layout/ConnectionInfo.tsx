import { useWalletConnectContext } from "context/WalletConnectContext"

export function ConnectionInfo() {
  const { accounts, connect, disconnect, isConnected, isLoading } =
    useWalletConnectContext()

  if (isLoading) {
    return <>Loading...</>
  }

  if (isConnected) {
    return (
      <>
        {accounts[0].slice(0, 8)}...{accounts[0].slice(-4)}
        <button onClick={disconnect}>Disconnect</button>
      </>
    )
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
    </>
  )
}
