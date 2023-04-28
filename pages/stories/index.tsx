import { PixelButton } from "@/components/Buttons";
import { Divider } from "@/components/Divider";
import { TextBlock } from "@/components/TextBlock";
import { TextPost, getAllTexts } from "@/texts/utils";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

type Props = {
    stories: TextPost[],
};
export const getStaticProps: GetStaticProps<Props> = async function () {
    let stories = await getAllTexts();
    return {
        props: {
            stories,
        }
    };
}

export default function AllStorites({ stories }: Props) {
    return <>
        <Head>
            <title>Все рассказы</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <TextBlock>
            <h1>Все рассказы</h1>
            {stories.map((story, idx) =>
                <div key={story.title ?? idx.toString()} dangerouslySetInnerHTML={{ __html: story.html }} />
            )}
            <nav style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10pt',
                justifyContent: 'space-between',
                marginTop: '20pt',
                marginBottom: '20pt',
            }}>
                <Link href='/'><PixelButton color="skyblue" text="Главная" /></Link>
            </nav>
        </TextBlock>
    </>
}