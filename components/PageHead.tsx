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
    </Head>
}