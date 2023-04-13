import { ReactNode } from "react";
import { Cormorant } from '@next/font/google';
const textFont = Cormorant({
    subsets: ['cyrillic-ext'],
    weight: '600',
    variable: '--font-text',
});

export function HtmlBlock({ html }: {
    html: string,
}) {
    return <TextBlock>
        <div dangerouslySetInnerHTML={{ __html: html }} />
    </TextBlock>
}

export function TextBlock({ children }: {
    children?: ReactNode,
}) {
    return <div className="container">
        <div className={`post ${textFont.variable}`}>
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
                font-family: var(--font-text), serif;
            }
            `}</style>
        <style>{`
            h1 {
                font-size: 1.5em;
                margin-bottom: 1em;
            }
            p {
                text-indent: 2em;
                line-height: 1.2em;   /* within paragraph */
                margin-bottom: 1em; /* between paragraphs */
            }
            `}</style>
    </div>;
}