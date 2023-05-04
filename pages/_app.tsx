import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Press_Start_2P } from '@next/font/google'
import { Cormorant } from '@next/font/google'
import Script from 'next/script'

const textFont = Cormorant({
  subsets: ['cyrillic-ext'],
  weight: '600',
  variable: '--font-text',
})
const p2p = Press_Start_2P({
  subsets: ['cyrillic-ext'],
  weight: '400',
  variable: '--font-pixel',
  display: 'block',
})

export default function App({ Component, pageProps }: AppProps) {
  return <main className={`${textFont.variable} ${p2p.variable}`}>
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-SE6H2FX2N9"
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-SE6H2FX2N9');
        `}
    </Script>
    <Component {...pageProps} />
  </main>
}
