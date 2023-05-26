'use client'
import { ReactNode, useState } from "react"
import Link from "next/link"
import { TextPostMap } from "@/utils/text"
import { Draggable } from "@/components/Draggable"
import { useQuery } from "@/utils/query"
import { useRouter } from "next/navigation"
import { PixelToggle } from "@/components/Buttons"
import { href } from "@/utils/refs"
import { AboutCard, HighlightKind, SketchCard, TextCard } from "@/components/Cards"
import { Scene } from "@/sketcher"
import { loveMeTwoTimes } from "@/sketches/posters/loveMeTwoTimes"
import { titleAtom } from "@/sketches/atoms"
import { titleRythm } from "@/sketches/rythm"
import { PixelPage } from "@/components/PixelPage"
import { fourFlowers, letters, number34 } from "@/sketches/misc"

// @refresh reset

type SketchCardProps = {
    sketch: Scene,
    id?: string,
    collection?: string,
};
const sketchCards = {
    posters: {
        id: undefined,
        collection: 'posters',
        sketch: loveMeTwoTimes(),
    },
    number34: {
        id: 'number34',
        collection: 'misc',
        sketch: number34(),
    },
    atoms: {
        id: undefined,
        collection: 'atoms',
        sketch: titleAtom(),
    },
    typography: {
        id: 'letters',
        collection: 'misc',
        sketch: letters(),
    },
    rave: {
        id: 'four-flowers',
        collection: 'misc',
        sketch: fourFlowers(),
    },
    rythm: {
        id: undefined,
        collection: 'rythm',
        sketch: titleRythm(),
    },
}

export function MainPage({ previews }: {
    previews: TextPostMap,
}) {
    let { hue = 40 } = useQuery()
    let router = useRouter()

    let [hl, setHl] = useState<HighlightKind | undefined>(undefined)
    let [free, setFree] = useState(true)
    let [pixelated, setPixelated] = useState(false)
    function nextHue() {
        let hues = [40, 210, 340, 100]
        let idx = hues.findIndex(h => h === hue) + 1
        let nextHue = idx >= 0 && idx < hues.length ? hues[idx]! : hues[0]!
        router.push(`/?hue=${nextHue}`)
    }
    function sketchTile(
        key: keyof typeof sketchCards,
        position: [number, number],
        order?: number,
    ) {
        let { id, collection, sketch } = sketchCards[key]
        return <Tile
            key={'sketch-' + key}
            shifted={free}
            position={position}
            link={href('sketch', { id, collection, hue })}
            highlight={hl === 'posters'}
            order={order}
        >
            <SketchCard
                sketch={sketch}
                pixelated={pixelated}
            />
        </Tile>
    }
    function storyTile(id: string, position: [number, number]) {
        return <Tile shifted={free} position={position} key={id}
            link={href('text', { id, hue })}
            highlight={hl === 'stories'}
        >
            <TextCard
                post={previews[id]!}
            />
        </Tile>
    }
    return <PixelPage>
        <div className="flex flex-col flex-nowrap items-center min-h-screen">
            <header className="flex flex-row flex-wrap justify-between items-center self-end grow-0">
                <div className="p-stn">
                    {/* <HelpButton hue={hue} /> */}
                </div>
                <div className="flex flex-row flex-wrap justify-end gap-stn p-stn">
                    <PixelToggle
                        color="red"
                        onClick={() => setFree(v => !v)}
                        pressed={!free}
                    />
                    <PixelToggle
                        color={pixelated ? "black" : "yellow"}
                        onClick={() => setPixelated(true)}
                        pressed={pixelated}
                    />
                    <PixelToggle
                        color="green"
                        onClick={nextHue}
                    />
                </div>
            </header>
            <div style={free ? {
                display: 'grid',
                gridTemplateAreas: '"mid"',
                placeItems: 'center center',
                width: '100%',
                flexGrow: 1,
            } : {
                display: 'flex',
                flexFlow: 'row wrap',
                alignContent: 'center',
                justifyContent: 'center',
                gap: 'var(--padding)',
                padding: 'var(--padding)',
                width: '100%',
                maxWidth: 'var(--collection)',
                height: '100%',
            }}>
                {[
                    sketchTile('posters', [5, -18]),
                    sketchTile('atoms', [-20, 0], 1),
                    sketchTile('typography', [13, 17]),
                    storyTile('start-wearing-purple', [-15, -10]),
                    storyTile('thirty-four', [7, 5]),
                    sketchTile('rythm', [25, 10], -1),
                    sketchTile('rave', [10, -6]),
                    sketchTile('number34', [-20, 15]),
                    storyTile('salmon', [-8, 12]),
                ]}
                <Tile
                    shifted={free} position={[20, -15]}
                    order={2}
                >
                    <Help hue={hue} />
                </Tile>
                <Tile shifted={free} position={[0, 0]} order={-2}>
                    <AboutCard
                        hue={hue}
                        onHover={setHl}
                    />
                </Tile>
            </div>
        </div>
    </PixelPage>
}

function Tile({
    position: [left, top], shifted,
    children, front, back, link, highlight,
    order,
}: {
    position: [number, number],
    shifted: boolean,
    children: ReactNode,
    link?: string,
    front?: boolean,
    back?: boolean,
    highlight?: boolean,
    order?: number,
}) {
    let navigable = true
    function lock() { navigable = false }
    function unlock() { setTimeout(() => { navigable = true }) }
    let content = link
        ? <Link draggable={false} href={link}
            onClick={event => {
                if (!navigable)
                    event.preventDefault()
            }}
        >
            <Draggable
                onDrag={lock}
                onStop={unlock}
                front={front || highlight}
                back={back}
                disabled={!shifted}
            >
                {children}
            </Draggable>
        </Link>
        : <Draggable front={front} back={back} disabled={!shifted}>
            {children}
        </Draggable>
    return <div style={{
        display: 'flex',
        position: shifted ? 'relative' : 'static',
        top: shifted ? `${top - 10}vh` : 0,
        left: shifted ? `${left}vw` : 0,
        gridArea: 'mid',
        transform: highlight ? 'scale(1.2)' : undefined,
        transition: 'transform .3s',
        order: !shifted ? order : undefined,
    }}>
        {content}
    </div>
}

function Help({ hue }: {
    hue: number,
}) {
    return <div className="container pixel-shadow">
        <div className="content pixel-corners" style={{
            backgroundColor: 'white',
            padding: 'var(--padding)',
            color: 'red',
        }}>
            <Link href={href('about-en', { hue })} style={{
                color: 'red',
            }}>
                Help!
            </Link>
        </div>
    </div>
}