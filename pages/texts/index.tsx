import { HomeButton } from "@/components/Buttons"
import { TextCard } from "@/components/Cards"
import { PixelPage } from "@/components/PixelPage"
import { href } from "@/utils/refs"
import { TextPostMap, getAllPreviews } from "@/utils/text"
import { GetStaticProps } from "next"
import Link from "next/link"

type Props = {
    previews: TextPostMap,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
    let previews = await getAllPreviews()
    return {
        props: {
            previews,
        }
    }
}

export default function AllStorites({ previews }: Props) {
    return <PixelPage
        title="Все рассказы"
        description="Страница со всеми рассказами"
    >
        <div className="outer">
            <div className="container">
                {Object.entries(previews).map(([id, story], idx) =>
                    <Link key={idx} href={href('text', { id })}>
                        <TextCard text={story} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <HomeButton />
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
            gap: var(--padding);
            padding: var(--padding);
        }
        .navigation {
            display: flex;
            justify-content: space-around;
            padding: var(--padding);
        }
        `}</style>
    </PixelPage>
}