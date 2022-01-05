import { AppProps } from "next/app"
import { ErrorBoundary } from "components/ErrorBoundary"
import { ThemeProvider } from "context/theme/ThemeProvider"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
