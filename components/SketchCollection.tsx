import { SketchCollection } from "@/sketcher";
import { SketchCard } from "./Cards";
import { PixelPage } from "./PixelPage";
import { useQuery } from "@/utils/query";
import { HomeButton } from "./Buttons";

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
            padding: 10pt;
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
            gap: 10pt;
            padding: 10pt;
            width: 100%;
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

// TODO: move?
export function SketchCollectionPage({ ...rest }: Parameters<typeof SketchCollectionBlock>[0]) {
    let { hue } = useQuery();
    // TODO: add title and description
    return <PixelPage hue={hue}>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10pt',
        }}>
            <SketchCollectionBlock {...rest} />
            <HomeButton />
        </div>
    </PixelPage>
}