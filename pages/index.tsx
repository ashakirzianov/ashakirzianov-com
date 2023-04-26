import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { posters } from "@/sketches/posters";
import { TextPost, getAllTexts } from "@/texts";
import { Draggable } from "@/components/Draggable";
import Head from "next/head";
import { PixelPage } from "@/components/PixelPage";
import { useQuery } from "@/hooks/query";
import { useRouter } from "next/router";
import { PixelButton } from "@/components/Buttons";

// @refresh reset

type Props = {
  posts: TextPost[];
};
export const getStaticProps: GetStaticProps<Props> = async function () {
  let posts = await getAllTexts();
  return {
    props: {
      posts,
    }
  };
}

type HighlightKind = 'stories' | 'posters';
export default function Main({
  posts,
}: Props) {
  let { hue } = useQuery();
  let router = useRouter();

  let [hl, setHl] = useState<HighlightKind | undefined>(undefined);
  let [grid, setGrid] = useState(true);
  let [pixelated, setPixelated] = useState(false);
  function nextHue() {
    let hues = [40, 210, 340, 360];
    let idx = hues.findIndex(h => h > hue);
    let nextHue = idx >= 0 ? hues[idx]! : hues[0]!;
    router.push(`/?hue=${nextHue}`, undefined, { shallow: true });
  }
  return <PixelPage hue={hue}>
    <Head>
      <title>Анҗан</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="buttons">
      <PixelButton
        color="red"
        onClick={() => setGrid(v => !v)}
        toggle
      />
      <PixelButton
        color="yellow"
        onClick={() => setPixelated(v => !v)}
        toggle once
      />
      <PixelButton
        color="green"
        onClick={nextHue}
      />
    </div>
    <div className={grid ? 'grid' : 'flex'}>
      <Tile shifted={grid} position={[0, 0]} front>
        <AboutCard
          hue={hue}
          onHover={setHl}
        />
      </Tile>
      <Tile shifted={grid} position={[5, -18]}
        link="/posters/0"
        highlight={hl === 'posters'}
      >
        <SketchCard
          sketch={posters[0]!}
          pixelated={pixelated}
        />
      </Tile>
      <Tile shifted={grid} position={[-17, 7]}
        link="/posters/1"
        highlight={hl === 'posters'}
      >
        <SketchCard
          sketch={posters[1]!}
          pixelated={pixelated}
        />
      </Tile>
      <Tile shifted={grid} position={[-10, 15]}
        link="/posters/2"
        highlight={hl === 'posters'}
      >
        <SketchCard
          sketch={posters[2]!}
          pixelated={pixelated}
        />
      </Tile>
      <Tile shifted={grid} position={[23, 10]}
        link="/stories/thirty-four"
        highlight={hl === 'stories'}
      >
        <TextPostCard
          post={posts[0]!}
        />
      </Tile>
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
        justify-content: center;
        gap: 10pt;
        padding: 10pt;
        width: 100%;
        height: 100%;
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
    ><Draggable
      onDrag={lock}
      onStop={unlock}
      front={front}
      disabled={!shifted}
    >
        {children}
      </Draggable></Link>
    : <Draggable front={front} disabled={!shifted}>
      {children}
    </Draggable>
  return <div style={{
    position: shifted ? 'relative' : 'static',
    top: shifted ? `${top}vh` : 0,
    left: shifted ? `${left}vw` : 0,
    gridArea: 'mid',
    transform: highlight ? 'scale(1.2)' : undefined,
    transition: 'transform .3s',
  }}>
    {content}
  </div>
}

function Card({
  children,
}: {
  children?: ReactNode,
}) {
  return <div className="pixel-shadow">
    <div className="card-frame pixel-corners">
      {children}
    </div>
  </div>
}

function SketchCard({ sketch, pixelated }: {
  sketch: Scene<any>,
  pixelated: boolean,
}) {
  let u = 20;
  let { node } = useSketcher({
    scene: sketch, period: 40,
    dimensions: pixelated ? [3 * u, 4 * u] : undefined,
  });
  return <div>
    <Card>{node}</Card>
  </div>;
}

function TextPostCard({ post }: {
  post: TextPost,
}) {
  return <Card>
    <div className="container">
      <div className="post noselect" dangerouslySetInnerHTML={{ __html: post.html }} />
      <style jsx>{`
      .container {
        display: flex;
        justify-content: center;
        align-items: start;
        height: 100%;
        width: 100%;
        background-color: var(--paper-light);
        color: var(--foreground-light);
        word-break: break-word;
      }
      .post {
        overflow: hidden;
        font-size: 5pt;
        max-height: 200pt;
        padding: 3em 5%;
        width: 100%;
      }
      `}</style>
      <style>{`
      h1 {
          margin-bottom: 12pt;
          line-height: 12pt;
      }
      p {
          text-indent: 12pt;
          line-height: 6pt;
          margin-bottom: 6pt;
      }
    `}</style>
    </div>
  </Card>;
}

function AboutCard({ hue, onHover }: {
  hue: number,
  onHover?: (target?: HighlightKind) => void,
}) {
  return <Card>
    <div className="content noselect" unselectable="on">
      —Привет! Меня зовут <span>Анҗан</span>. Я пишу <TextLink href='/stories' highlight="stories" onHover={onHover}>рассказы</TextLink> и делаю <TextLink href={`/posters?hue=${hue}`} highlight="posters" onHover={onHover}>постеры</TextLink>.
      <p>&nbsp;</p>
      — Что? Кто ты такой и <TextLink href={`/about?hue=${hue}`}>что это за буква җ?</TextLink>

      <style jsx>{`
    .content {
      color: var(--foreground-light);
      background-color: var(--paper-light);
      text-indent: 1em;
      line-height: 1.2em;
      padding: 10%;
      width: 100%;
      height: 100%;
    }
    span {
      color: var(--foreground-light);
    }
    `}</style>
    </div>
  </Card >;
}

function TextLink({ children, href, highlight, onHover }: {
  href: string,
  children?: ReactNode,
  highlight?: HighlightKind,
  onHover?: (target?: HighlightKind) => void,
}) {
  return <Link href={href} legacyBehavior>
    <a
      onMouseOver={function () {
        if (onHover && highlight) {
          onHover(highlight)
        }
      }}
      onMouseLeave={function () {
        if (onHover) {
          onHover(undefined);
        }
      }}
      onMouseOut={function () {
        if (onHover) {
          onHover(undefined);
        }
      }}>{children}</a>
  </Link>;
}