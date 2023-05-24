'use client'

import { SketchPage } from "@/components/Pages"
import { collections } from "../collections"
import { notFound } from "next/navigation"
import { Scene, sceneId } from "@/sketcher"
import { useSketcher } from "@/utils/sketcher"

export function SingleSketch({ collectionId, sketchId }: {
    collectionId: string,
    sketchId: string,
}) {
    let collection = collections.find(c => c.id === collectionId)
    if (!collection) {
        return notFound()
    }
    let sketch = collection.sketches.find(s => sceneId(s) === sketchId)
    if (!sketch) {
        let sketchIdx = parseInt(sketchId, 10)
        if (sketchIdx >= 0 && sketchIdx < collection.sketches.length) {
            sketch = collection.sketches[sketchIdx]
        }
    }
    if (!sketch) {
        return notFound()
    }
    return <SingleSketchImpl scene={sketch} />
}

function SingleSketchImpl({ scene }: {
    scene: Scene,
}) {
    let { node } = useSketcher({
        scene,
        period: 40,
    })

    return <SketchPage
        title={scene.title}
        description={'Dynamic poster'}
    >
        <div>
            {node}
        </div>
    </SketchPage>
}