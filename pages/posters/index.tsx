import { Page } from "@/components/Page";
import { useQuery } from "@/hooks/query";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { posters } from "@/sketches/posters";
import Link from "next/link";

type Props = {};

export default function AllPosters({ }: Props) {
    let { hue } = useQuery();
    return <Page hue={hue}>
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
    </Page>
}

function PosterCard({ scene }: {
    scene: Scene,
}) {
    let { node } = useSketcher({
        scene, period: 40,
    });
    return <div className="container">
        <div className="content pixel-corners">
            {node}
        </div>
        <style jsx>{`
        .container {
            filter: drop-shadow(10px 10px 0px #222);
        }
        .content {
            display: flex;
            overflow: hidden;
            clip-path: border-box;
            aspect-ratio: 3/4;
            width: min(200px, 50vw);
            border-radius: var(--radius);
        }
        `}</style>
    </div>
}