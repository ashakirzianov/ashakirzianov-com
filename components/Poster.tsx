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
        }
        `}</style>
    </div>
}