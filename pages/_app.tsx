import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { AppProps } from 'next/app'
import { AppProvider } from "../src/contexts/AppContext"
import '../src/styles/globals.css'

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
