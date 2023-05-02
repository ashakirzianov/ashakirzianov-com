import { SketchCollection } from "@/sketcher";
import { SketchCard } from "./Cards";

export function SketchCollectionBlock({
    collection: { meta, sketches },
    hrefForId,
}: {
    collection: SketchCollection,
    hrefForId: (id: string) => string,
}) {
    return <>
        <div className="outer">
            {/* TODO: make a link */}
            <span className="title">{meta.title}</span>
            <div className="container">
                {Object.entries(sketches).map(([id, scene], idx) =>
                    <a key={idx} href={hrefForId(id)}>
                        <SketchCard sketch={scene} pixelated={false} />
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
    hrefForIds: (collectionId: string, id: string) => string,
}) {
    return <>
        <div className="collections">
            {
                collections.map((collection, idx) =>
                    <SketchCollectionBlock
                        key={`${collection.id}-${idx}`}
                        collection={collection}
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