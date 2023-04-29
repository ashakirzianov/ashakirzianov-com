import { PixelButton } from "@/components/Buttons";
import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/utils/query";
import { href } from "@/utils/refs";
import { TextPost, TextPostMap, getAllPreviews } from "@/utils/text";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
    previews: TextPostMap,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
    let previews = await getAllPreviews();
    return {
        props: {
            previews,
        }
    };
}

export default function AllStorites({ previews }: Props) {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>All Posters</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="outer">
            <div className="container">
                {Object.entries(previews).map(([id, story], idx) =>
                    <Link key={idx} href={href('text', { id })}>
                        <TextPostCard post={story} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <Link href={href('home', { hue })}>
                    <PixelButton color={`hsl(${hue},100%,80%)`} text="Главная" />
                </Link>
            </nav>
        </div>
        <style jsx>{`
        .outer {
            dispaly:flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
        }
        .container {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            gap: 10pt;
            padding: 10pt;
        }
        .navigation {
            display: flex;
            justify-content: space-around;
            padding: 10pt;
        }
        `}</style>
    </PixelPage>
}

function TextPostCard({ post }: {
    post: TextPost,
}) {
    return <Card>
        <div className="container">
            <div className="post noselect" dangerouslySetInnerHTML={{ __html: post.html }} />
            <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: start;
          height: 100%;
          width: 100%;
          background-color: var(--paper-light);
          color: var(--foreground-light);
          word-break: break-word;
        }
        .post {
          overflow: hidden;
          font-size: .4em;
          max-height: 42em;
          padding: 3em 5%;
          width: 100%;
        }
        `}</style>
            <style>{`
        h1 {
            margin-top: .5em;
            margin-bottom: 1em;
            line-height: 1em;
        }
        p {
            text-indent: 1em;
            line-height: 1em;
            margin-bottom: 1em;
        }
      `}</style>
        </div>
    </Card>;
}

function Card({
    children,
}: {
    children?: ReactNode,
}) {
    return <div className="pixel-shadow">
        <div className="card-frame pixel-corners">
            {children}
        </div>
    </div>
}