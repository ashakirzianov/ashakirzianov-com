import { PixelButton } from "@/components/Buttons";
import { Divider } from "@/components/Divider";
import { TextBlock } from "@/components/TextBlock";
import { href } from "@/utils/refs";
import { TextPost, getAllTextIds, getTextForId } from "@/utils/text";
import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async function () {
    let ids = await getAllTextIds();
    return {
        paths: ids.map(id => ({ params: { id } })),
        fallback: 'blocking',
    };
}

type Props = { post: TextPost };
export const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
    let id = params?.id as string;
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
            <nav style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10pt',
                justifyContent: 'space-between',
                marginTop: '20pt',
                marginBottom: '20pt',
            }}>
                <Link href={href('text')}>
                    <PixelButton color="skyblue">Все рассказы</PixelButton>
                </Link>
                <Link href={href('home')}>
                    <PixelButton color="skyblue" >Главная</PixelButton>
                </Link>
            </nav>
        </TextBlock>
    </>;
}