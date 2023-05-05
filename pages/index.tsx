import { ReactNode, useState } from "react"
import Link from "next/link"
import { GetStaticProps } from "next"
import { TextPost, getAllPreviews } from "@/utils/text"
import { Draggable } from "@/components/Draggable"
import { useQuery } from "@/utils/query"
import { useRouter } from "next/router"
import { PixelToggle } from "@/components/Buttons"
import { href } from "@/utils/refs"
import { AboutCard, HighlightKind, SketchCard, TextCard } from "@/components/Cards"
import { Scene } from "@/sketcher"
import { loveMeTwoTimes } from "@/sketches/posters/loveMeTwoTimes"
import { number34 } from "@/sketches/misc/number34"
import { titleAtom } from "@/sketches/atoms"
import { letters } from "@/sketches/misc/letters"
import { fourFlowers } from "@/sketches/misc/4flowers"
import { titleRythm } from "@/sketches/rythm"
import { PixelPageImpl } from "@/components/Pages"

// @refresh reset

type Posts = {
  [key: string]: TextPost,
};
type Props = {
  previews: Posts,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
  let previews = await getAllPreviews()
  return {
    props: {
      previews,
    }
  }
}

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

export default function Main({
  previews,
}: Props) {
  let { hue = 40 } = useQuery()
  let router = useRouter()

  let [hl, setHl] = useState<HighlightKind | undefined>(undefined)
  let [free, setFree] = useState(true)
  let [pixelated, setPixelated] = useState(false)
  function nextHue() {
    let hues = [40, 210, 340, 100]
    let idx = hues.findIndex(h => h === hue) + 1
    let nextHue = idx >= 0 && idx < hues.length ? hues[idx]! : hues[0]!
    router.push(`/?hue=${nextHue}`, undefined, { shallow: true })
  }
  function sketchTile(
    key: keyof typeof sketchCards,
    position: [number, number],
  ) {
    let { id, collection, sketch } = sketchCards[key]
    return <Tile
      key={'sketch-' + key}
      shifted={free}
      position={position}
      link={href('sketch', { id, collection, hue })}
      highlight={hl === 'posters'}
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
        text={previews[id]!}
      />
    </Tile>
  }
  return <PixelPageImpl
    hue={hue}
    title="Анҗан"
    description="Сайт с буквами и картинками"
  >
    <div className="outer">
      <header>
        <div className="help">
          {/* <HelpButton hue={hue} /> */}
        </div>
        <div className="buttons">
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
      <div className={free ? 'grid' : 'flex'}>
        <Tile shifted={free} position={[0, 0]} front>
          <AboutCard
            hue={hue}
            onHover={setHl}
          />
        </Tile>
        {[
          sketchTile('posters', [5, -18]),
          sketchTile('number34', [-10, 15]),
          sketchTile('rythm', [-5, 8]),
          sketchTile('atoms', [-22, 7]),
          storyTile('thirty-four', [25, 10]),
          storyTile('apartunist', [13, 20]),
          sketchTile('typography', [7, 5]),
          sketchTile('rave', [10, -6]),
          storyTile('start-wearing-purple', [-15, -10]),
        ]}
        <Tile
          shifted={free} position={[20, -15]} back
        >
          <Help hue={hue} />
        </Tile>
      </div>
    </div>
    <style jsx>{`
      .outer {
        display: flex;
        flex-flow: column nowrap;
        min-height: 100vh;
      }
      header {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        flex-grow: 0;
      }
      .help {
        padding: var(--padding);
      }
      .buttons {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        gap: var(--padding);
        padding: var(--padding);
      }
      .grid {
        display: grid;
        grid-template-areas: "mid";
        place-items: center center;
        width: 100%;
        flex-grow: 1;
      }
      .flex {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        justify-content: flex-start;
        gap: var(--padding);
        padding: var(--padding);
        width: 100%;
        height: 100%;
      }
      @media (max-width: 700pt) {
        .flex {
          justify-content: center;
        }
      }
      `}</style>
  </PixelPageImpl>
}

function Tile({
  position: [left, top], shifted,
  children, front, back, link, highlight,
}: {
  position: [number, number],
  shifted: boolean,
  children: ReactNode,
  link?: string,
  front?: boolean,
  back?: boolean,
  highlight?: boolean,
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
        front={front}
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
  }}>
    {content}
  </div>
}

function Help({ hue }: {
  hue: number,
}) {
  return <>
    <div className="container pixel-shadow">
      <div className="content pixel-corners" style={{
        backgroundColor: 'white',
        padding: 'var(--padding)',
        color: 'red',
      }}>
        <Link href={href('about-en', { hue })} style={{
        }}>
          Help!
        </Link>
      </div>
    </div>
  </>
}