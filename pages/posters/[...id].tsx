import { GetStaticPaths, GetStaticProps } from "next"
import {
    bwway, loveMeTwoTimes,
} from "@/sketches/posters";
import { useSketcher } from "@/hooks/sketcher";
import { PosterPage } from "@/components/PosterPage";

export const posters = [
    loveMeTwoTimes(),
    bwway(),
];

// @refresh reset

export const getStaticPaths: GetStaticPaths = async function () {
    return {
        paths: posters.map((_, idx) => ({ params: { id: [idx.toString()] } })),
        fallback: 'blocking',
    };
}

type Props = { index: number };
export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
    let id = params?.id?.[0] ?? '0';
    let index = parseInt(id, 10);
    if (0 <= index && index < posters.length) {
        return { props: { index } };
    } else {
        return { notFound: true };
    }
}

export default function SketchComponent({ index }: Props) {
    let scene = posters[index]!;
    let { node } = useSketcher({
        scene,
        period: 40,
    });

    return <PosterPage
        title={scene.title ?? 'Poster'}
        description={scene.description ?? 'Dynamic poster'}
    >
        <div>
            {node}
        </div>
    </PosterPage>;
}