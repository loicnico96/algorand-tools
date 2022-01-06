import { AppProps } from "next/app"
import { ErrorBoundary } from "components/ErrorBoundary"
import { ThemeProvider } from "context/theme/ThemeProvider"
import { NetworkContextProvider } from "context/NetworkContext"
import { WalletConnectContextProvider } from "context/WalletConnectContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NetworkContextProvider>
          <WalletConnectContextProvider>
            <Component {...pageProps} />
          </WalletConnectContextProvider>
        </NetworkContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
