import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/utils/query";
import { useSketcher } from "@/utils/sketcher";
import { Scene } from "@/sketcher";
import { posters } from "@/sketches/posters";
import Head from "next/head";
import Link from "next/link";

type Props = {};

export default function AllPosters({ }: Props) {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>All Posters</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="container">
            {posters.map((poster, idx) =>
                <Link key={idx} href={`/posters/${idx}`}>
                    <PosterCard scene={poster} />
                </Link>
            )}
            <style jsx>{`
        .container {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            min-height: 100vh;
            gap: 10pt;
            padding: 10pt;
        }
        `}</style>
        </div>
    </PixelPage>
}

function PosterCard({ scene }: {
    scene: Scene,
}) {
    let { node } = useSketcher({
        scene, period: 40,
    });
    return <div className="pixel-shadow">
        <div className="card-frame pixel-corners">
            {node}
        </div>
    </div>
}