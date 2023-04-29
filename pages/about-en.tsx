import { PixelPage } from "@/components/PixelPage";
import { TextBlock } from "@/components/TextBlock";
import { useQuery } from "@/utils/query";
import { href } from "@/utils/refs";
import Head from "next/head";
import Link from "next/link";
import { AboutCard } from "./about";

export default function AboutPage() {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AboutCard>
            <h1>{`I don't speak the language, help me!`}</h1>
            <p>{`Relax, this is just my personal page. My name is Anton Shakirzianov, but I use a pen name "Andjan" (or "Анҗан" in Cyrillics).`}</p>
            <p>I do <Link href={href('art', { hue })}>generative art</Link>. I also write <Link href={href('text', { hue })}>short stories</Link>, fiction and not quite fiction, though they are all in my native Russian.</p>
            <p>I have <Link href='https://instagram.com/ashakirzianov'>instagram</Link> and <Link href='https://t.me/ashakirzianov_live'>telegram</Link>.</p>
        </AboutCard>
    </PixelPage>
}