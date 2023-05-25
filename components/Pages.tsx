'use client'
import { useQuery } from "@/utils/query"
import { ReactNode } from "react"
import Head from "next/head"

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
        <div className="flex justify-center items-center w-screen h-screen max-h-screen"
            style={{
                gridArea: 'mid',
                fontSize: 'min(80vh,90vw)',
                color: `hsl(${hue},45%,65%)`,
            }}>Җ</div>
        <div className="flex flex-col w-full min-h-screen"
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