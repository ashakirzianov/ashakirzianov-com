import { href } from "@/utils/refs"
import Head from "next/head"
import { AboutCard, AboutLink } from "./about"
import { useQuery } from "@/utils/query"
import { PixelPage } from "@/components/Pages"

export default function AboutPage() {
    let { hue } = useQuery()
    return <PixelPage
        title="Who is Andjan?"
        description="I am Anton Shakirzianov and this is my personal page"
    >
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AboutCard>
            <h1>{`Help me, I don't speak the language!`}</h1>
            <p>{`Relax, this is just my personal page. My name is Anton Shakirzianov, but I use a pen name "Andjan" (or "Анҗан" in Cyrillics).`}</p>
            <p>I do <AboutLink href={href('sketch', { hue })}>generative art</AboutLink>. I also write <AboutLink href={href('text', { hue })}>short stories</AboutLink>, fiction and not quite fiction, though they are all in Russian.</p>
            <p>I have <AboutLink href='https://instagram.com/ashakirzianov'>instagram</AboutLink> and <AboutLink href='https://t.me/ashakirzianov_live'>telegram</AboutLink>.</p>
        </AboutCard>
    </PixelPage>
}