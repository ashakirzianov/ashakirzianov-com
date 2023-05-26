'use client'
import { SketchCollectionBlock } from "@/components/SketchCollection"
import { collections } from "@/sketches"

export function AllCollections() {
    return <div className="flex flex-col items-center gap-stn">
        {
            collections.map((collection, idx) =>
                <SketchCollectionBlock
                    key={`${collection.id}-${idx}`}
                    collection={collection}
                    linkToCollection={true}
                />
            )
        }
    </div>
}