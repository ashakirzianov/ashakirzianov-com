import { AllStoriesButton, HomeButton, Language } from "@/components/Buttons"
import { PageHead } from "@/components/Pages"
import { TextBlock } from "@/components/TextBlock"
import { href } from "@/utils/refs"
import { getAllTextIds, getTextForId } from "@/utils/text"
import Link from "next/link"
import { notFound } from 'next/navigation'
import { ReactNode } from "react"

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
    let language: Language = post.language === 'en' ? 'en' : 'ru'
    return <>
        <PageHead
            title={post.title ?? 'Рассказ'}
            description={post.description ?? `${post.textSnippet}...`}
        />
        <TextBlock>
            {post.title && <h1 id={post.id}>{post.title}</h1>}
            <LinkBlock>
                {post.translation?.en && <Link href={href('text', { id: post.translation.en })}>English translation</Link>}
                {post.translation?.ru && <Link href={href('text', { id: post.translation.ru })}>Перевод</Link>}
                {post.original?.en && <Link href={href('text', { id: post.original.en })}>English original</Link>}
                {post.original?.ru && <Link href={href('text', { id: post.original.ru })}>Original</Link>}
            </LinkBlock>
            <div className="mb-4" />
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <nav className="flex flex-col items-center gap-stn justify-between mt-l mb-stn">
                <AllStoriesButton language={language} />
                <HomeButton language={language} />
            </nav>
        </TextBlock>
    </>
}

function LinkBlock({ children }: {
    children?: ReactNode,
}) {
    return <div className="flex flex-col text-left italic text-base w-full">
        {children}
    </div>
}