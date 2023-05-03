import { AllSketchesButton, HomeButton } from "@/components/Buttons"
import { TextPostPage } from "@/components/Pages"
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

export default function Page({ post }: Props) {
    return <TextPostPage post={post} />
}