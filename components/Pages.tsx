'use client'
import { useQuery } from "@/utils/query"
import { ReactNode } from "react"
import { SketchCollectionBlock, SketchMulticollection } from "./SketchCollection"
import Head from "next/head"
import { AllSketchesButton, HomeButton, Language } from "./Buttons"
import { SketchCollection } from "@/sketcher"
import { href } from "@/utils/refs"
import { TextPost, TextPostMap } from "@/utils/text"
import Link from "next/link"
import { TextCard } from "./Cards"
import { TextBlock } from "./TextBlock"
import { AllStoriesButton } from "./Buttons"

export type PageHeaderProps = {
    title: string,
    description: string,
}
export function PageHead({ title, description }: PageHeaderProps) {
    return <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
    </Head>
}

type PixelPageProps = PageHeaderProps & {
    children: ReactNode,
};
export function PixelPage({ children, ...rest }: PixelPageProps) {
    let { hue } = useQuery()
    return <PixelPageImpl hue={hue ?? 40} {...rest}>
        {children}
    </PixelPageImpl>
}

export function PixelPageImpl({ hue, children }: PixelPageProps & {
    hue: number,
}) {

    return <div
        className="grid w-screen h-screen max-h-screen select-none cursor-default font-pixel place-items-start"
        style={{
            gridTemplateAreas: '"mid"',
            backgroundColor: `hsl(${hue},60%,65%)`,
        }}>
        <div className="flex justify-center items-center w-screen h-screen"
            style={{
                gridArea: 'mid',
                fontSize: 'min(80vh,90vw)',
                color: `hsl(${hue},45%,65%)`,
            }}>Җ</div>
        <div
            className="flex flex-col w-full min-h-screen"
            style={{
                gridArea: 'mid',
            }}>{children}</div>
        <style>{`
        body {
            background-color: hsl(${hue},60%,65%);
        }
      `}</style>
    </div>
}

export function SketchPage({
    title, description, children,
}: {
    title?: string,
    description?: string,
    children?: ReactNode,
}) {
    return (
        <>
            <PageHead
                title={title ?? 'Sketch'}
                description={description ?? title ?? 'Generative sketch'}
            />
            <main>
                <div className="flex items-start justify-center h-screen w-screen" style={{
                    padding: 'min(10vh,40pt) min(2vw,20pt)',
                }}>
                    <div className="flex aspect-poster m-w-full m-h-full drop-shadow-2xl">
                        <div className="flex w-full h-full items-stretch rounded-lg overflow-hidden" style={{
                            clipPath: 'border-box',
                        }}>
                            {children ?? null}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export function SketchCollectionPage({ ...rest }: Parameters<typeof SketchCollectionBlock>[0]) {
    let { collection: { meta } } = rest
    return <PixelPage
        title={meta.title}
        description={meta.description ?? `Серия скетчей: ${meta.title}`}
    >
        <div className="flex flex-col items-center gap-stn p-stn">
            <SketchCollectionBlock {...rest} />
            <footer className="flex flex-col items-center gap-stn p-stn">
                <AllSketchesButton />
                <HomeButton />
            </footer >
        </div>
    </PixelPage>
}

export function AllSketchesPage({ collections }: {
    collections: SketchCollection[]
}) {
    return <PixelPage
        title="Все скетчи"
        description="Страница со всеми картинками"
    >
        <div className="flex flex-col items-center p-stn">
            <SketchMulticollection
                collections={collections}
            />
            <footer className="pt-l pb-stn">
                <HomeButton />
            </footer>
        </div>
    </PixelPage>
}

function LinkBlock({ children }: {
    children?: ReactNode,
}) {
    return <div className="flex flex-col text-left italic text-base w-full">
        {children}
    </div>
}

export function TextPostPage({ post }: {
    post: TextPost,
}) {
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

export function AllStoritesPage({ previews, language }: {
    previews: TextPostMap,
    language?: Language,
}) {
    let title = language === 'en' ? 'All stories' : 'Все рассказы'
    let description = language === 'en' ? 'All stories' : 'Страница со всеми рассказами'
    let pairs = Object.entries(previews)
        .sort(([, a], [, b]) => b?.date?.localeCompare(a?.date ?? '') ?? 0)
    return <PixelPage
        title={title}
        description={description}
    >
        <div className="flex flex-col items-center justify-start max-w-collection">
            <div className="flex flex-row flex-wrap content-start gap-stn p-stn">
                {pairs.map(([id, story], idx) =>
                    <Link key={idx} href={href('text', { id })}>
                        <TextCard post={story} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <HomeButton language={language} />
            </nav>
        </div>
    </PixelPage>
}