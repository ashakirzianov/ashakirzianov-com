import { SingleSketch } from "./client"

export default function Sketch({ params: { collection, sketch } }: {
    params: { collection: string, sketch: string },
}) {
    return <SingleSketch collectionId={collection} sketchId={sketch} />
}