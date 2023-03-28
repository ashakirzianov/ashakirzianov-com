import { Scene, randomInt } from "@/sketcher";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { GetServerSideProps } from "next";

export function multipager({
    variations,
    title, description, titlePlaceholder, descriptionPlaceholder,
    period, skip, chunk,
}: {
    title?: string,
    titlePlaceholder?: string,
    description?: string,
    descriptionPlaceholder?: string,
    variations: Scene[],
    period?: number,
    skip?: number,
    chunk?: number,
}) {
    type Props = {
        index: number,
    };
    const getServerSideProps: GetServerSideProps<Props> = async function ({ params }) {
        let id = params?.id?.[0] ?? 'index';
        switch (id) {
            case 'index':
            case 'random':
                return {
                    props: { index: randomInt(variations.length), },
                };
            default:
                let index = parseInt(id, 10);
                if (0 <= index && index < variations.length) {
                    return { props: { index } };
                } else {
                    return { notFound: true };
                }
        }
    }

    function SketchComponent({ index }: Props) {
        let scene = variations[index]!;
        let { node } = useSketcher({
            scene,
            period: period ?? 40,
            skip,
            chunk,
        });

        return <PosterPage
            title={title ?? scene.title ?? titlePlaceholder}
            description={description ?? scene.description ?? descriptionPlaceholder}
        >
            <div>
                {node}
            </div>
        </PosterPage>;
    }

    return {
        getServerSideProps,
        SketchComponent,
    };
}
