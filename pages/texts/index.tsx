import { PixelButton } from "@/components/Buttons";
import { TextCard } from "@/components/Cards";
import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/utils/query";
import { href } from "@/utils/refs";
import { TextPost, TextPostMap, getAllPreviews } from "@/utils/text";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    previews: TextPostMap,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
    let previews = await getAllPreviews();
    return {
        props: {
            previews,
        }
    };
}

export default function AllStorites({ previews }: Props) {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>All Posters</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="outer">
            <div className="container">
                {Object.entries(previews).map(([id, story], idx) =>
                    <Link key={idx} href={href('text', { id })}>
                        <TextCard text={story} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <Link href={href('home', { hue })}>
                    <PixelButton color={`hsl(${hue},100%,80%)`} >Главная</PixelButton>
                </Link>
            </nav>
        </div>
        <style jsx>{`
        .outer {
            dispaly:flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
        }
        .container {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            gap: 10pt;
            padding: 10pt;
        }
        .navigation {
            display: flex;
            justify-content: space-around;
            padding: 10pt;
        }
        `}</style>
    </PixelPage>
}