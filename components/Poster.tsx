import { ReactNode } from "react"

export type PosterProps = {
    children?: ReactNode,
}
export function Poster({ children }: PosterProps) {
    return <div className="poster">
        {children ?? null}
        <style jsx>{`
        .poster {
            aspect-ratio: 3 / 4;
            box-shadow: 0 4px 8px 0px rgba(0,0,0,0.2);
            border-radius: 5px;
            max-width: 100%;
            max-height: 100%;
            display: flex;
        }
        `}</style>
    </div>
}