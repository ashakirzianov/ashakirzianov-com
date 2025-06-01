'use client'

import { notFound } from "next/navigation"
import { Scene } from "@/sketcher"
import { useSketcher } from "@/utils/sketcher"
import { findCollectionSketch } from "@/app/collection"

export function SingleSketch({ collectionId, sketchId }: {
    collectionId: string,
    sketchId: string,
}) {
    let { sketch } = findCollectionSketch(collectionId, sketchId)
    if (!sketch) {
        return notFound()
    }
    return <SingleSketchImpl scene={sketch} />
}

export function SingleSketchImpl({ scene }: {
    scene: Scene,
}) {
    let { node } = useSketcher({
        scene,
        period: 40,
    })
    return <main>
        <div className="flex items-start justify-center h-screen w-screen" style={{
            padding: 'min(10vh,40pt) min(2vw,20pt)',
        }}>
            <div className="flex aspect-poster max-w-full max-h-full drop-shadow-2xl">
                <div className="flex w-full h-full items-stretch rounded-lg overflow-hidden" style={{
                    clipPath: 'border-box',
                }}>
                    {node}
                </div>
            </div>
        </div>
    </main>
}