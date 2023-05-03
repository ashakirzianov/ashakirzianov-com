import { SketchCollection } from "@/sketcher"
import { SketchCard } from "./Cards"
import Link from "next/link"

export function SketchCollectionBlock({
    collection: { meta, sketches, order },
    hrefForId,
    href,
}: {
    collection: SketchCollection,
    hrefForId: (id: string) => string,
    href?: string,
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
            {href
                ? <Link href={href}>{titleNode}</Link>
                : titleNode
            }
            <div className="container">
                {(order ?? Object.keys(sketches)).map((id, idx) =>
                    <a key={idx} href={hrefForId(id)}>
                        <SketchCard sketch={sketches[id]!} pixelated={false} />
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
            max-width: 720pt;
        }
        `}</style>
    </>
}

export function SketchMulticollection({
    collections, hrefForIds,
}: {
    collections: SketchCollection[],
    hrefForIds: (collectionId: string, id?: string) => string,
}) {
    return <>
        <div className="collections">
            {
                collections.map((collection, idx) =>
                    <SketchCollectionBlock
                        key={`${collection.id}-${idx}`}
                        collection={collection}
                        href={hrefForIds(collection.id
                        )}
                        hrefForId={id => hrefForIds(collection.id, id)}
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