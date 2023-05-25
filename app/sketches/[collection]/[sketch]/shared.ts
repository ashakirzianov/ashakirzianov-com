import { sceneId } from "@/sketcher"
import { collections } from "@/sketches"

export function findCollectionSketch(collectionId: string, sketchId: string) {
    let collection = collections.find(c => c.id === collectionId)
    if (!collection) {
        return {}
    }
    let sketch = collection.sketches.find(s => sceneId(s) === sketchId)
    if (!sketch) {
        let sketchIdx = parseInt(sketchId, 10)
        if (sketchIdx >= 0 && sketchIdx < collection.sketches.length) {
            sketch = collection.sketches[sketchIdx]
        }
    }
    return { sketch, collection }
}