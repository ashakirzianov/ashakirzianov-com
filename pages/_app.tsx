import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Press_Start_2P } from '@next/font/google'
import { Cormorant } from '@next/font/google'
import useGoogleAnalytics from '@/utils/googleAnalytics'

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
  useGoogleAnalytics('G-SE6H2FX2N9')
  return <main className={`${textFont.variable} ${p2p.variable}`}>
    <Component {...pageProps} />
  </main>
}
