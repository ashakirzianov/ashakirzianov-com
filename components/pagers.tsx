import { SketchCollection, sceneId } from "@/sketcher"
import { useSketcher } from "@/utils/sketcher"
import { GetStaticPaths, GetStaticProps } from "next"
import { SketchCollectionPage, SketchPage } from "./Pages"

export function sketchCollectionPager({
    collection, path,
}: {
    collection: SketchCollection,
    path: string,
}) {
    type Props = {
        idx: number | null,
    };
    const getStaticPaths: GetStaticPaths = async function () {
        let dynamic = collection.sketches.map((sketch, idx) => {
            if (sketch.id === undefined) {
                return { params: { id: [idx.toString()] } }
            } else {
                return { params: { id: [sketch.id] } }
            }
        })
        return {
            paths: [
                { params: { id: ['index'] } },
                ...dynamic,
            ],
            fallback: 'blocking',
        }
    }
    const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
        let id = params?.id?.[0] ?? 'index'
        if (id === 'index') {
            return { props: { idx: null } }
        }
        let sketchIdx = collection.sketches.findIndex(
            sketch => sceneId(sketch) === id
        )
        if (sketchIdx !== -1) {
            return { props: { idx: sketchIdx } }
        }
        let idx = parseInt(id, 10)
        if (idx >= 0 && idx <= collection.sketches.length) {
            return { props: { idx } }
        }
        return { notFound: true }
    }

    function SingleSketch({ idx }: {
        idx: number,
    }) {
        let scene = collection.sketches[idx]!
        let { node } = useSketcher({
            scene,
            period: 40,
        })

        return <SketchPage
            title={scene.title || collection.meta.title}
            description={scene.description || collection.meta.description || 'Dynamic poster'}
        >
            <div>
                {node}
            </div>
        </SketchPage>
    }

    function Page({ idx }: Props) {
        if (typeof idx === 'number') {
            return <SingleSketch idx={idx} />
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
        Page,
    }
}
