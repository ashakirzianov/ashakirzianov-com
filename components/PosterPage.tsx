import { Card } from "@/components/Card";
import { Poster } from "@/components/Poster";
import Head from "next/head";
import { ReactNode } from "react";

export function PosterPage({
    title, description, children,
}: {
    title: string,
    description?: string,
    children?: ReactNode,
}) {
    return (
        <>
            <Head>
                <title>{title}</title>
                {description ? <meta name="description" content="Knot sketch" /> : null}
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <div className="poster-page">
                    <Poster>
                        {children ?? null}
                    </Poster>
                </div>
                <style jsx>{`
                .poster-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    align-content: center;
                    height: 100vh;
                    width: 100vw;
                    padding: 50px;
                }
                `}</style>
            </main>
        </>
    )
}