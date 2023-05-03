import { useQuery } from "@/utils/query"
import { ReactNode } from "react"
import { SketchCollectionBlock, SketchMulticollection } from "./SketchCollection";
import Head from "next/head";
import { AllSketchesButton, HomeButton } from "./Buttons";
import { SketchCollection } from "@/sketcher";
import { href } from "@/utils/refs";

export type PageHeaderProps = {
    title: string,
    description: string,
}
export function PageHead({ title, description }: PageHeaderProps) {
    return <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
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

export function PixelPageImpl({ hue, children, ...header }: PixelPageProps & {
    hue: number,
}) {
    return <>
        <PageHead {...header} />
        <div className="page">
            <div className="back">Җ</div>
            <div className="content">{children}</div>
        </div>
        <style jsx>{`
        .page {
          display: grid;
          grid-template-areas: "mid";
          place-items: center center;
          width: 100%;
          min-height: 100vh;
          -webkit-user-select: none; /* Safari */
          -ms-user-select: none; /* IE 10 and IE 11 */
          user-select: none; /* Standard syntax */
          cursor: default;
          font-family: var(--font-pixel), serif;
        }
        .back {
          grid-area: mid;
          font-size: min(80vh,90vw);
          color: hsl(${hue},45%,65%);
        }
        .content {
          grid-area: mid;
          display: flex;
          flex-direction: column;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
        <style jsx global>{`
        body {
            background-color: hsl(${hue},60%,65%);
        }
      `}</style>
    </>
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
                <div className="page">
                    <div className="container">
                        <div className="content">
                            {children ?? null}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                .page {
                    display: flex;
                    align-items: start;
                    justify-content: center;
                    height: 100vh;
                    width: 100vw;
                    padding: min(10vh,40pt) min(2vw,20pt);
                }
                .container {
                    display: flex;
                    aspect-ratio: 3 / 4;
                    max-width: 100%;
                    max-height: 100%;
                    filter: drop-shadow(0px 0px 20px var(--shadow));
                }
                .content {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: stretch;
                    justify-items: stretch;
                    border-radius: var(--radius);
                    clip-path: border-box;
                    overflow: hidden;
                }
                `}</style>
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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--padding)',
            padding: 'var(--padding)',
        }}>
            <SketchCollectionBlock {...rest} />
            <footer style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--padding)',
                padding: 'var(--padding)',
            }}>
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
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'var(--padding)'
        }}>
            <SketchMulticollection
                collections={collections}
                hrefForIds={(collection, id) => href('sketch', { id, collection })}
            />
            <footer>
                <HomeButton />
            </footer>
        </div>
    </PixelPage>
}