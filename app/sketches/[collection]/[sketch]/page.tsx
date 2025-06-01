import { Metadata } from "next"
import { SingleSketch } from "./client"
import { findCollectionSketch } from "./shared"
import { buildMetadata } from "@/utils/metadata"

export async function generateMetadata({
    params,
}: {
    params: Promise<{
        collection: string,
        sketch: string,
    }>,
}): Promise<Metadata> {
    const { collection: collectionId, sketch: sketchId } = await params
    let { sketch, collection } = findCollectionSketch(collectionId, sketchId)
    return buildMetadata({
        title: sketch?.title ?? collection?.meta.title ?? 'Sketch',
        description: sketch?.description ?? collection?.meta.description ?? 'Generative Sketch',
    })
}

export default async function Sketch({ params }: {
    params: Promise<{ collection: string, sketch: string }>,
}) {
    const { collection, sketch } = await params
    return <SingleSketch collectionId={collection} sketchId={sketch} />
}