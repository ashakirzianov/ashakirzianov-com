import { GetStaticPaths, GetStaticProps } from "next"
import { useSketcher } from "@/utils/sketcher";
import { PosterPage } from "@/components/PosterPage";
import { wip } from "@/sketches/wip";

// @refresh reset

export const getStaticPaths: GetStaticPaths = async function () {
    return {
        paths: wip.map(
            (_, idx) => ({ params: { id: idx.toString() } })
        ),
        fallback: 'blocking',
    };
}

type Props = { idx: number };
export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
    let idx = typeof params?.id === 'string'
        ? parseInt(params.id, 10) : 0;
    if (idx >= 0 && idx < wip.length) {
        return { props: { idx } };
    } else {
        return { notFound: true };
    }
}

export default function SketchComponent({ idx }: Props) {
    let scene = wip[idx]!;
    let { node } = useSketcher({
        scene,
        period: 40,
    });
    return <PosterPage
        title={scene.title || 'Work In Progress'}
        description={scene.description || 'Undeveloped idea'}
    >
        <div>
            {node}
        </div>
    </PosterPage>;
}