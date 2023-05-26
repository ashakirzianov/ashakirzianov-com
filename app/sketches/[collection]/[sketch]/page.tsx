import { Metadata } from "next"
import { SingleSketch } from "./client"
import { findCollectionSketch } from "./shared"
import { buildMetadata } from "@/utils/metadata"

export async function generateMetadata({
    params: { collection: collectionId, sketch: sketchId },
}: {
    params: {
        collection: string,
        sketch: string,
    },
}): Promise<Metadata> {
    let { sketch, collection } = findCollectionSketch(collectionId, sketchId)
    return buildMetadata({
        title: sketch?.title ?? collection?.meta.title ?? 'Sketch',
        description: sketch?.description ?? collection?.meta.description ?? 'Generative Sketch',
    })
}

export default function Sketch({ params: { collection, sketch } }: {
    params: { collection: string, sketch: string },
}) {
    return <SingleSketch collectionId={collection} sketchId={sketch} />
}