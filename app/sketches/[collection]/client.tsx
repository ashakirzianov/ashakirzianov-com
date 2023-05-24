'use client'
import { SketchCollectionPage } from "@/components/Pages"
import { notFound } from "next/navigation"
import { collections } from "./collections"

export function CollectionPage({ collectionId }: {
    collectionId: string
}) {
    let collection = collections.find(c => c.id === collectionId)
    if (!collection) {
        return notFound()
    }
    return <SketchCollectionPage
        collection={collection}
        collectionId={collectionId}
    />
}