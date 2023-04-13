import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import {
    bwway, loveMeTwoTimes,
} from "@/sketches/posters";
import Link from "next/link";
export const posters = [
    loveMeTwoTimes(),
    bwway(),
];

export default function AllPosters() {
    return <div className="container">
        {posters.map((poster, idx) =>
            <Link href={`/posters/${idx}`}>
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
}

function PosterCard({ scene }: {
    scene: Scene,
}) {
    let { node } = useSketcher({
        scene, period: 40,
    });
    return <div className="container">
        <div className="content">
            {node}
        </div>
        <style jsx>{`
        .container {
            filter: drop-shadow(0px 0px 20px var(--shadow));
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