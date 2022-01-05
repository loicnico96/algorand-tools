import { Theme, ThemeProvider as BaseThemeProvider } from "@emotion/react"
import { useState } from "react"
import { GlobalStyle } from "./GlobalStyle"
import { ProviderProps } from "../types"

declare module "@emotion/react" {
  export interface Theme {
    fonts: string[]
  }
}

export const defaultTheme: Theme = {
  fonts: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Roboto",
    "Segoe UI",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Fira Sans",
    "Droid Sans",
    "Helvetica Neue",
    "sans-serif",
  ],
}

export function ThemeProvider({ children }: ProviderProps) {
  const [theme] = useState(defaultTheme)

  return (
    <BaseThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </BaseThemeProvider>
  )
}
