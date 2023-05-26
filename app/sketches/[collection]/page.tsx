import { collections } from "@/sketches"
import { CollectionPage } from "./client"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export async function generateStaticParams() {
    return collections.map(collection => ({
        collection: collection.id,
    }))
}

export async function generateMetadata({ params: { collection: collectionId } }: {
    params: { collection: string },
}): Promise<Metadata> {
    let collection = collections.find(c => c.id === collectionId)
    return buildMetadata({
        title: collection?.meta.title ?? "Скетчи",
        description: collection?.meta?.description ?? `Серия скетчей: ${collection?.meta.title}`,
    })
}

export default function Collection({ params: { collection } }: {
    params: { collection: string },
}) {
    return <CollectionPage collectionId={collection} />
}