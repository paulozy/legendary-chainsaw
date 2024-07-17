import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { AppProps } from 'next/app'
import '../src/styles/globals.css'
import { AppProvider } from "./contexts/AppContext"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default MyApp
