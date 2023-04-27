import { TextBlock } from "@/components/TextBlock";
import { TextPost, getAllTextIds, getTextForId } from "@/texts/utils";
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head";

export const getStaticPaths: GetStaticPaths = async function () {
    let ids = await getAllTextIds();
    return {
        paths: ids.map(id => ({ params: { id: [id] } })),
        fallback: 'blocking',
    };
}

type Props = { post: TextPost };
export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
    let id = params?.id?.[0];
    if (id === undefined) {
        return { notFound: true };
    }
    let post = await getTextForId({ id });
    if (post === undefined) {
        return { notFound: true };
    }

    return { props: { post } };
}

export default function TextPostPage({ post }: Props) {
    return <>
        <Head>
            <title>{post.title ?? 'Post'}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <TextBlock>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </TextBlock>
    </>;
}