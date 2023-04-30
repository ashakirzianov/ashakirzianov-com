import { SketchCollection } from "@/sketcher";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/utils/sketcher";
import { GetStaticPaths, GetStaticProps } from "next";
import { SketchCollectionPage } from "./SketchCollection";

export function sketchCollection({
    collection, path,
}: {
    collection: SketchCollection,
    path: string,
}) {
    type Props = {
        id: string | null,
    };
    const getStaticPaths: GetStaticPaths = async function () {
        let dynamic = Object.keys(collection.sketches).map(
            id => ({
                params: { id: [id] }
            })
        );
        return {
            paths: [
                { params: { id: ['index'] } },
                ...dynamic,
            ],
            fallback: 'blocking',
        }
    }
    const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
        let id = params?.id?.[0] ?? 'index';
        if (id === 'index') {
            return { props: { id: null } };
        } else if (id in collection.sketches) {
            return {
                props: { id }
            }
        } else {
            return { notFound: true };
        }
    }

    function SingleSketch({ id }: {
        id: string,
    }) {
        let scene = collection.sketches[id]!;
        let { node } = useSketcher({
            scene,
            period: 40,
        });

        return <PosterPage
            title={scene.title || collection.meta.title}
            description={scene.description || collection.meta.description || 'Dynamic poster'}
        >
            <div>
                {node}
            </div>
        </PosterPage>
    }

    function SketchPage({ id }: Props) {
        if (id !== null) {
            return <SingleSketch id={id} />
        } else {
            return <SketchCollectionPage
                collection={collection}
                hrefForId={id => `${path}/${id}`}
            />
        }
    }

    return {
        getStaticPaths,
        getStaticProps,
        SketchPage,
    };
}
