import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { finished } from "@/sketches/finished";
import { TextPost, getAllPreviews } from "@/utils/text";
import { Draggable } from "@/components/Draggable";
import Head from "next/head";
import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/utils/query";
import { useRouter } from "next/router";
import { PixelToggle } from "@/components/Buttons";
import { href } from "@/utils/refs";
import { AboutCard, HighlightKind, SketchCard, TextCard } from "@/components/Cards";

// @refresh reset

type Posts = {
  [key: string]: TextPost,
};
type Props = {
  previews: Posts,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
  let previews = await getAllPreviews();
  return {
    props: {
      previews,
    }
  };
}

export default function Main({
  previews,
}: Props) {
  let { hue } = useQuery();
  let router = useRouter();

  let [hl, setHl] = useState<HighlightKind | undefined>(undefined);
  let [free, setFree] = useState(true);
  let [pixelated, setPixelated] = useState(false);
  function nextHue() {
    let hues = [40, 210, 340, 100];
    let idx = hues.findIndex(h => h === hue) + 1;
    let nextHue = idx >= 0 && idx < hues.length ? hues[idx]! : hues[0]!;
    router.push(`/?hue=${nextHue}`, undefined, { shallow: true });
  }
  function sketchTile(id: string, position: [number, number]) {
    return <Tile
      key={'gen-' + id}
      shifted={free}
      position={position}
      link={href('art', { id })}
      highlight={hl === 'posters'}
    >
      <SketchCard
        sketch={finished[id as keyof typeof finished]!}
        pixelated={pixelated}
      />
    </Tile>
  }
  function storyTile(id: string, position: [number, number]) {
    return <Tile shifted={free} position={position} key={id}
      link={href('text', { id })}
      highlight={hl === 'stories'}
    >
      <TextCard
        text={previews[id]!}
      />
    </Tile>;
  }
  return <PixelPage hue={hue}>
    <Head>
      <title>Анҗан</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
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
    <div className={free ? 'grid' : 'flex'}>
      <Tile shifted={free} position={[0, 0]} front>
        <AboutCard
          hue={hue}
          onHover={setHl}
        />
      </Tile>
      {[
        storyTile('thirty-four', [25, 10]),
        sketchTile('lmtt', [5, -18]),
        sketchTile('bwway', [-22, 7]),
        sketchTile('number34', [-10, 15]),
        storyTile('start-wearing-purple', [13, 20]),
        sketchTile('typography', [-12, -5]),
        sketchTile('rave', [10, -6]),
        sketchTile('slinky', [7, 8]),
        storyTile('seattle', [-15, -10]),
        sketchTile('molecules', [13, -1]),
      ]}
    </div>
    <style jsx>{`
      .buttons {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        gap: 10pt;
        padding: 10pt;
      }
      .grid {
        display: grid;
        grid-template-areas: "mid";
        place-items: center center;
        width: 100%;
        height: 100%;
      }
      .flex {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        justify-content: flex-start;
        gap: 10pt;
        padding: 10pt;
        width: 100%;
        height: 100%;
      }
      @media (max-width: 470pt) {
        .flex {
          justify-content: center;
        }
      }
      `}</style>
  </PixelPage>
}

function Tile({
  position: [left, top], shifted,
  children, front, link, highlight,
}: {
  position: [number, number],
  shifted: boolean,
  children: ReactNode,
  link?: string,
  front?: boolean,
  highlight?: boolean,
}) {
  let navigable = true;
  function lock() { navigable = false; }
  function unlock() { setTimeout(() => { navigable = true; }) }
  let content = link
    ? <Link draggable={false} href={link}
      onClick={event => {
        if (!navigable)
          event.preventDefault();
      }}
    >
      <Draggable
        onDrag={lock}
        onStop={unlock}
        front={front}
        disabled={!shifted}
      >
        {children}
      </Draggable>
    </Link>
    : <Draggable front={front} disabled={!shifted}>
      {children}
    </Draggable>
  return <div style={{
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