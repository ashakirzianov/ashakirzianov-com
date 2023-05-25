import { collections } from "@/sketches"
import { CollectionPage } from "./client"

export async function generateStaticParams() {
    return collections.map(collection => ({
        collection: collection.id,
    }))
}

export default function Collection({ params: { collection } }: {
    params: { collection: string },
}) {
    return <CollectionPage collectionId={collection} />
}