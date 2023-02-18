import { ReactNode } from "react"

export type PosterProps = {
    children?: ReactNode,
}
export function Poster({ children }: PosterProps) {
    return <div className="poster">
        <div className="poster-content">
            {children ?? null}
        </div>
        <style jsx>{`
        .poster-content {
            display: flex;
            align-items: stretch;
            justify-items: stretch;
            border-radius: 5px;
            clip-path: border-box;
        }
        .poster {
            display: flex;
            aspect-ratio: 3 / 4;
            box-shadow: 0 1.6px 3.6px 0 rgba(0,0,0,.4),0 .3px .9px 0 rgba(0,0,0,.4);
            border-radius: 5px;
            max-width: 100%;
            max-height: 100%;
        }
        `}</style>
    </div>
}