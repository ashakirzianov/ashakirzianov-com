import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { variations } from "@/sketches/knots";
import { GetStaticPaths, GetStaticProps } from "next";

// @refresh reset

export const getStaticPaths: GetStaticPaths = async function () {
    let paths = variations.map(
        (_, idx) => ({
            params: {
                id: `${idx}`,
            },
        }),
    );
    return {
        paths,
        fallback: false,
    };
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
    let id = params!.id as string;
    let idx = parseInt(id, 10);
    return {
        props: {
            index: idx,
        },
    };
}
type Props = {
    index: number,
};
export default function Knots({ index }: Props) {
    let { node } = useSketcher({
        scene: variations[index]!,
        period: 40,
    });
    return <PosterPage title="Knots" description="Knots series">
        <div>
            {node}
        </div>
    </PosterPage>;
}