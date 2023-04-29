import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/utils/query";
import { useSketcher } from "@/utils/sketcher";
import { Scene } from "@/sketcher";
import { finished } from "@/sketches/finished";
import Head from "next/head";
import Link from "next/link";
import { PixelButton } from "@/components/Buttons";
import { href } from "@/utils/refs";
import { SketchCard } from "@/components/Cards";

type Props = {};

export default function AllPosters({ }: Props) {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>All Posters</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="outer">
            <div className="container">
                {Object.entries(finished).map(([id, scene], idx) =>
                    <Link key={idx} href={href('art', { id })}>
                        <SketchCard sketch={scene} pixelated={false} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <Link href={href('home', { hue })}>
                    <PixelButton color={`hsl(${hue},100%,80%)`} text="Главная" />
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