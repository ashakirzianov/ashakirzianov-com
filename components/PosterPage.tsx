import { ReactNode } from "react";
import { PageHead } from "./PageHead";

export function PosterPage({
    title, description, children,
}: {
    title?: string,
    description?: string,
    children?: ReactNode,
}) {
    return (
        <>
            <PageHead
                title={title ?? 'Sketch'}
                description={description ?? title ?? 'Generative sketch'}
            />
            <main>
                <div className="page">
                    <div className="container">
                        <div className="content">
                            {children ?? null}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                .page {
                    display: flex;
                    align-items: start;
                    justify-content: center;
                    height: 100vh;
                    width: 100vw;
                    padding: min(10vh,40pt) min(2vw,20pt);
                }
                .container {
                    display: flex;
                    aspect-ratio: 3 / 4;
                    max-width: 100%;
                    max-height: 100%;
                    filter: drop-shadow(0px 0px 20px var(--shadow));
                }
                .content {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: stretch;
                    justify-items: stretch;
                    border-radius: var(--radius);
                    clip-path: border-box;
                    overflow: hidden;
                }
                `}</style>
            </main>
        </>
    )
}