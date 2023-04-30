import Head from "next/head";
import Link from "next/link";
import { Scene } from "@/sketcher";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/utils/sketcher";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { PixelPage } from "./PixelPage";
import { useQuery } from "@/utils/query";
import { SketchCard } from "./Cards";
import { PixelButton } from "./Buttons";
import { href } from "@/utils/refs";

export function sketchCollection({
    variations, path, title, description,
}: {
    variations: Scene<any>[],
    path: string,
    title?: string,
    titlePlaceholder?: string,
    description?: string,
}) {
    type Props = {
        index: number | null,
    };
    const getStaticPaths: GetStaticPaths = async function () {
        let dynamic = variations.map(
            (_, idx) => ({
                params: {
                    id: [idx.toString()],
                }
            })
        );
        return {
            paths: [
                { params: { id: ['index'] } },
                { params: { id: [''] } },
                ...dynamic,
            ],
            fallback: 'blocking',
        }
    }
    const getStaticProps: GetStaticProps<Props> = async function ({ params }) {
        let id = params?.id?.[0] ?? 'index';
        switch (id) {
            case 'index':
            case '':
                return {
                    props: { index: null },
                };
            default:
                let index = parseInt(id, 10);
                if (0 <= index && index < variations.length) {
                    return { props: { index } };
                } else {
                    return { notFound: true };
                }
        }
    }

    function SketchCollection() {
        let { hue } = useQuery();
        return <PixelPage hue={hue}>
            <Head>
                <title>{title || "Sketches"}</title>
                <meta name="description" content={description || 'Sketch collection'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="outer">
                <div className="container">
                    {variations.map((scene, idx) =>
                        <a key={idx} href={`${path}/${idx}`}>
                            <SketchCard sketch={scene} pixelated={false} />
                        </a>
                    )}
                </div>
                <nav className="navigation">
                    <Link href={href('home', { hue })} replace={false} shallow={false}>
                        <PixelButton color={`hsl(${hue},100%,80%)`}>Главная</PixelButton>
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

    function SingleSketch({ index }: {
        index: number,
    }) {
        let scene = variations[index ?? 0]!;
        let { node } = useSketcher({
            scene,
            period: 40,
        });

        return <PosterPage
            title={scene.title || 'Poster'}
            description={scene.description || 'Dynamic poster'}
        >
            <div>
                {node}
            </div>
        </PosterPage>
    }

    function SketchPage({ index }: Props) {
        if (index !== null) {
            return <SingleSketch index={index} />
        } else {
            return <SketchCollection />
        }
    }

    return {
        getStaticPaths,
        getStaticProps,
        SketchPage,
    };
}
