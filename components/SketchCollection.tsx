'use client'
import { SketchCollection, sceneId } from "@/sketcher"
import { SketchCard } from "./Cards"
import Link from "next/link"
import { href } from "@/utils/refs"

export function SketchCollectionBlock({
    collection: { meta, sketches },
    collectionId, linkToCollection,
}: {
    collection: SketchCollection,
    collectionId: string,
    linkToCollection?: boolean,
}) {
    let titleNode = <span style={{
        display: 'flex',
        color: 'white',
        padding: 'var(--padding)',
    }}>
        {meta.title}
    </span>
    return <>
        <div className="outer">
            {linkToCollection
                ? <Link href={href('sketch', { collection: collectionId })}>{titleNode}</Link>
                : titleNode
            }
            <div className="container">
                {(sketches).map((sketch, idx) =>
                    <a key={idx} href={href('sketch', { id: sceneId(sketch) ?? idx.toString(), collection: collectionId })}>
                        <SketchCard sketch={sketch} pixelated={false} />
                    </a>
                )}
            </div>
        </div>
        <style jsx>{`
        .title {
            display: flex;
            color: white;
            padding: var(--padding);
        }
        .outer {
            display: flex;
            flex-flow: column wrap;
            align-items: center;
        }
        .container {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            justify-content: center;
            gap: var(--padding);
            padding: var(--padding);
            width: 100%;
            max-width: calc(3 * var(--card-width) + 4 * var(--padding));
        }
        `}</style>
    </>
}

export function SketchMulticollection({
    collections,
}: {
    collections: SketchCollection[],
}) {
    return <>
        <div className="collections">
            {
                collections.map((collection, idx) =>
                    <SketchCollectionBlock
                        key={`${collection.id}-${idx}`}
                        collection={collection}
                        collectionId={collection.id}
                        linkToCollection={true}
                    />
                )
            }
        </div>
        <style jsx>{`
        .collections {
            display: flex;
            flex-flow: column wrap;
            align-items: center;
        }
        `}</style>
    </>
}