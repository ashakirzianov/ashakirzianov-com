import { Page } from "@/components/Page";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { posters } from "@/sketches/posters";
import Link from "next/link";
import { useRouter } from "next/router";

function getNumber(s: string | string[] | undefined) {
    if (s === undefined) {
        return undefined;
    } else if (typeof s === 'string') {
        return parseInt(s, 10);
    } else {
        return parseInt(s[0] ?? '', 10);
    }
}

type Props = {};

export default function AllPosters({ }: Props) {
    let { hue } = useRouter().query;
    return <Page hue={getNumber(hue) ?? 40}>
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
        .pixel-corners {
            clip-path: polygon(
              0px 9px,
              3px 9px,
              3px 3px,
              6px 3px,
              9px 3px,
              9px 0px,
              calc(100% - 9px) 0px,
              calc(100% - 9px) 3px,
              calc(100% - 3px) 3px,
              calc(100% - 3px) 6px,
              calc(100% - 3px) 9px,
              100% 9px,
              100% calc(100% - 9px),
              calc(100% - 3px) calc(100% - 9px),
              calc(100% - 3px) calc(100% - 3px),
              calc(100% - 6px) calc(100% - 3px),
              calc(100% - 9px) calc(100% - 3px),
              calc(100% - 9px) 100%,
              9px 100%,
              9px calc(100% - 3px),
              3px calc(100% - 3px),
              3px calc(100% - 6px),
              3px calc(100% - 9px),
              0px calc(100% - 9px)
            );
          }
        `}</style>
    </div>
}