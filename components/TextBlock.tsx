import { ReactNode } from "react";

export function TextBlock({ font, children }: {
    font?: string,
    children?: ReactNode,
}) {
    let family = font ?? 'var(--font-text), serif';
    return <div className="container">
        <div className="post">
            {children}
        </div>
        <style jsx>{`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            .post {
                padding: 10pt;
                max-width: min(540pt, 100%);
                font-size: 140%;
                font-family: ${family};
            }
            `}</style>
        <style>{`
            h1 {
                font-size: 1.5em;
                font-weight: bold;
                margin-bottom: 1em;
            }
            p {
                text-indent: 2em;
                line-height: 1.2em;   /* within paragraph */
                margin-bottom: .4em; /* between paragraphs */
            }
            `}</style>
    </div>;
}