import { Scene, randomInt } from "@/sketcher";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { GetStaticPaths, GetStaticProps } from "next";

export function multipager({
    variations, title, description,
    period, skip, chunk,
}: {
    title: string,
    description: string,
    variations: Scene[],
    period?: number,
    skip?: number,
    chunk?: number,
}) {
    const getStaticPaths: GetStaticPaths = async function () {
        return {
            paths: [
                {
                    params: { id: [] },
                },
                {
                    params: { id: ['index'] },
                },
                {
                    params: { id: ['random'] },
                },
                ...variations.map(
                    (_, idx) => ({
                        params: {
                            id: [`${idx}`],
                        },
                    }),
                ),
            ],
            fallback: false,
        };
    }

    type Props = {
        kind: 'index',
        index: number,
    } | {
        kind: 'random',
    };
    const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
        let id = params!.id as string;
        let index = parseInt(id, 10);
        if (Number.isNaN(index)) {
            return {
                props: { kind: 'random' },
            };
        } else {
            return {
                props: {
                    kind: 'index',
                    index: index,
                }
            }
        }
    }

    function SketchComponent(props: Props) {
        let index = props.kind === 'index'
            ? props.index
            : randomInt(variations.length);

        let { node } = useSketcher({
            scene: variations[index]!,
            period: period ?? 40,
            skip,
            chunk,
        });
        return <PosterPage title={title} description={description}>
            <div>
                {node}
            </div>
        </PosterPage>;
    }

    return {
        getStaticPaths, getStaticProps, SketchComponent,
    };
}
