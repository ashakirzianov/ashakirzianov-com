'use client'
import { SketchCollection, sceneId } from "@/sketcher"
import { SketchCard } from "./Cards"
import Link from "next/link"
import { href } from "@/utils/refs"

export function SketchCollectionBlock({
    collection: { id, meta, sketches },
    linkToCollection,
}: {
    collection: SketchCollection,
    linkToCollection?: boolean,
}) {
    let titleNode = <span className="flex text-white p-stn">
        {meta.title}
    </span>
    return <>
        <div className="flex flex-col flex-wrap items-center p-0 m-0">
            {linkToCollection
                ? <Link href={href('sketch', { collection: id })}>{titleNode}</Link>
                : titleNode
            }
            <div className="container flex flex-row flex-wrap content-start justify-center gap-stn w-full max-w-collection">
                {(sketches).map((sketch, idx) =>
                    <a key={idx} href={href('sketch', { id: sceneId(sketch) ?? idx.toString(), collection: id })}>
                        <SketchCard sketch={sketch} pixelated={false} />
                    </a>
                )}
            </div>
        </div>
    </>
}