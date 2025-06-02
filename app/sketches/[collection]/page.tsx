import { collections } from '@/sketches'
import { CollectionPage } from './client'
import { Metadata } from 'next'
import { buildMetadata } from '@/utils/metadata'

export async function generateStaticParams() {
    return collections.map(collection => ({
        collection: collection.id,
    }))
}

export async function generateMetadata({ params }: {
    params: Promise<{ collection: string }>,
}): Promise<Metadata> {
    const { collection: collectionId } = await params
    const collection = collections.find(c => c.id === collectionId)
    return buildMetadata({
        title: collection?.meta.title ?? 'Скетчи',
        description: collection?.meta?.description ?? `Серия скетчей: ${collection?.meta.title}`,
    })
}

export default async function Collection({ params, searchParams }: {
    params: Promise<{ collection: string }>,
    searchParams: Promise<{ hue?: number }>,
}) {
    const { hue } = await searchParams
    const { collection } = await params
    return <CollectionPage collectionId={collection} hue={hue} />
}