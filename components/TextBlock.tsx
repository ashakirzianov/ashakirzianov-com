import { ReactNode } from "react";

export function TextBlock({ children }: {
    children?: ReactNode,
}) {
    return <div className="container">
        <div className="post">
            {children}
        </div>
        <style jsx>{`
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                // font-family: Avenir Next,Helvetics,sans-serif;
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
    </div>;
}