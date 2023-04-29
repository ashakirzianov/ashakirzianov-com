import { GetStaticPaths, GetStaticProps } from "next"
import { useSketcher } from "@/utils/sketcher";
import { PosterPage } from "@/components/PosterPage";
import { finished } from "@/sketches/finished";

// @refresh reset

export const getStaticPaths: GetStaticPaths = async function () {
    return {
        paths: Object.keys(finished).map(
            id => ({ params: { id } })
        ),
        fallback: 'blocking',
    };
}

type Props = { id: keyof typeof finished };
export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
    let id = params?.id as string;
    if (id in finished) {
        return { props: { id: id as keyof typeof finished } };
    } else {
        return { notFound: true };
    }
}

export default function SketchComponent({ id }: Props) {
    let scene = finished[id];
    let { node } = useSketcher({
        scene,
        period: 40,
    });

    return <PosterPage
        title={scene.title || 'Poster'}
        description={scene.description || 'Dynamic poster'}
    >
        <div>
            {node}
        </div>
    </PosterPage>;
}