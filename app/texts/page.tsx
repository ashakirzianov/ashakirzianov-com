import { getPreviews } from '@/utils/text'
import { Metadata } from 'next'
import { buildMetadata } from '@/utils/metadata'
import { StoriesCollection } from '@/components/StoriesCollection'

export const metadata: Metadata = buildMetadata({
    title: 'Все рассказы',
    description: 'Страница со всеми рассказами',
})

export default async function AllStorites({ searchParams }: {
    searchParams: Promise<{ hue?: number }>
}) {
    const { hue } = await searchParams
    const previews = await getPreviews([
        'dummy',
        'start-wearing-purple',
        'april-fools',
        'grandpa',
        'apart',
        'thirty-four',
    ])
    return <StoriesCollection previews={previews} hue={hue} />
}