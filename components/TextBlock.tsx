import { ReactNode } from "react"

export function TextBlock({ font, children }: {
    font?: string,
    children?: ReactNode,
}) {
    let family = font ?? 'var(--font-text), serif'
    return <div className="flex justify-center items-center w-full">
        <div className="p-stn text-[140%]" style={{
            fontFamily: family,
            maxWidth: 'min(540pt, 100%)',
        }}>
            <style>{`
            h1 {
                font-size: 1.5em;
                font-weight: bold;
            }
            p {
                text-indent: 2em;
                line-height: 1.2em;   /* within paragraph */
                margin-bottom: .4em; /* between paragraphs */
            }
            `}</style>
            {children}
        </div>
    </div>
}