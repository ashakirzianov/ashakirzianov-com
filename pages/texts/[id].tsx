import { AllSketchesButton, HomeButton } from "@/components/Buttons"
import { TextBlock } from "@/components/TextBlock"
import { TextPost, getAllTextIds, getTextForId } from "@/utils/text"
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"

export const getStaticPaths: GetStaticPaths = async function () {
    let ids = await getAllTextIds()
    return {
        paths: ids.map(id => ({ params: { id } })),
        fallback: 'blocking',
    }
}

type Props = { post: TextPost };
export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
    let id = params?.id as string
    if (id === undefined) {
        return { notFound: true }
    }
    let post = await getTextForId({ id })
    if (post === undefined) {
        return { notFound: true }
    }

    return { props: { post } }
}

export default function TextPostPage({ post }: Props) {
    return <>
        <Head>
            <title>{post.title ?? 'Post'}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <TextBlock>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
            <nav style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--padding)',
                justifyContent: 'space-between',
                marginTop: '20pt',
                marginBottom: '20pt',
            }}>
                <AllSketchesButton />
                <HomeButton />
            </nav>
        </TextBlock>
    </>
}