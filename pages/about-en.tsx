import { PixelPage } from "@/components/PixelPage";
import { TextBlock } from "@/components/TextBlock";
import { useQuery } from "@/utils/query";
import { href } from "@/utils/refs";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="container pixel-shadow">
            <div className="content pixel-corners">
                <TextBlock font="var(--font-pixel)">
                    <h1>{`I don't speak the language, help me!`}</h1>
                    <p>{`Relax, this is just my personal page. My name is Anton Shakirzianov, but I use a pen name "Andjan" (or "Анҗан" in Cyrillics).`}</p>
                    <p>I do <Link href={href('art', { hue })}>generative art</Link>. I also write <Link href={href('text', { hue })}>short stories</Link>, fiction and not quite fiction, though they are all in my native Russian.</p>
                    <p>I have <Link href='https://instagram.com/ashakirzianov'>instagram</Link> and <Link href='https://t.me/ashakirzianov_live'>telegram</Link>.</p>
                </TextBlock>
            </div>
        </div>
        <style jsx>{`
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .content {
            margin: 10pt;
            background-color: var(--paper-light);
            color: var(--foreground-light);
            max-width: min(540pt, 100%);
        }
        `}</style>
    </PixelPage>
}