import { ReactNode } from "react"
import Script from "next/script"
import { Press_Start_2P } from "next/font/google"
import { Cormorant } from "next/font/google"
import '../styles/globals.css'

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

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="ru">
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
            <body className={`${textFont.variable} ${p2p.variable}`}>
                {children}
            </body>
        </html>
    )
}