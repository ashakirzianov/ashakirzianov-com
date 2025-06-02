import { getAllPreviews } from '@/utils/text'
import { Metadata } from 'next'
import { buildMetadata } from '@/utils/metadata'
import { StoriesCollection } from '@/components/StoriesCollection'

export const metadata: Metadata = buildMetadata({
    title: 'All Short Stories',
    description: 'Page with all short stories',
})

export default async function AllStorites({ searchParams }: {
    searchParams: Promise<{ hue?: number }>
}) {
    const { hue } = await searchParams
    const previews = await getAllPreviews('en')
    return <StoriesCollection previews={previews} language="en" hue={hue} />
}