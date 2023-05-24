import { TextPostPage } from "@/components/Pages"
import { getAllTextIds, getTextForId } from "@/utils/text"
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
    let ids = await getAllTextIds()
    return ids.map(id => ({ id }))
}

export default async function Page({ params: { id } }: {
    params: { id: string },
}) {
    let post = await getTextForId({ id })
    if (!post) {
        return notFound()
    }
    return <TextPostPage post={post} />
}