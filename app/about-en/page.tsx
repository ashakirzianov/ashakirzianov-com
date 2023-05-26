import { href } from "@/utils/refs"
import Head from "next/head"
import { PixelPage } from "@/components/PixelPage"
import { AboutCard, AboutLink } from "../about/shared"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: 'Who is Andjan?',
    description: 'I am Anton Shakirzianov and this is my personal page',
})

export default function AboutPage() {
    return <PixelPage>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AboutCard>
            <h1>{`Help me, I don't speak the language!`}</h1>
            <p>{`Hey, this is just my personal page. My name is Anton Shakirzianov, but I use a pen name "Andjan" (or "Анҗан" in Cyrillics).`}</p>
            <p>I do <AboutLink href={href('sketch')}>generative art</AboutLink>. I also write <AboutLink href={href('text')}>short stories</AboutLink> in my native language, but some are <AboutLink href={href('text', { id: 'en' })}>translated to English</AboutLink>. They are fiction, fact-meets-fiction, and everything in-between.</p>
            <p>I have <AboutLink href='https://instagram.com/ashakirzianov'>instagram</AboutLink> and <AboutLink href='https://t.me/ashakirzianov_live'>telegram</AboutLink>.</p>
        </AboutCard>
    </PixelPage>
}