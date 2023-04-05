import { TextPost, getAllTextIds, getTextForId } from "@/texts";
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
    let post = await getTextForId(id);
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
        <div className="container">
            <div className="post">
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
            </div>
            <style jsx>{`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Avenir Next,Helvetics,sans-serif;
                padding: 10pt;
                width: 100%;
            }
            .post {
                max-width: 480pt;
            }
            `}</style>
            <style>{`
            h1 {
                margin-bottom: 1em;
            }
            p {
                text-indent: 2em;
                line-height: 1.2em;   /* within paragraph */
                margin-bottom: 1em; /* between paragraphs */
            }
            `}</style>
        </div>
    </>;
}