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
  function Tile({
    position: [left, top], shifted, children
  }: {
    position: [number, number],
    shifted: boolean,
    children: ReactNode,
  }) {
    return <div className="card" style={{
      position: shifted ? 'relative' : 'static',
      top: shifted ? `${top}vh` : 0,
      left: shifted ? `${left}vw` : 0,
      gridArea: 'mid',
    }}>
      {children}
    </div>
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
      <Tile shifted={grid} position={[0, 0]}>
        <AboutCard
          hue={hue}
          onHover={setHl}
        />
      </Tile>
      <Tile shifted={grid} position={[5, -18]}>
        <PosterCard
          index={0}
          highlight={hl === 'posters'}
          pixelated={pixelated}
        />
      </Tile>
      <Tile shifted={grid} position={[-17, 7]}>
        <PosterCard
          index={1}
          highlight={hl === 'posters'}
          pixelated={pixelated}
        />
      </Tile>
      <Tile shifted={grid} position={[-10, 15]}>
        <PosterCard
          index={2}
          highlight={hl === 'posters'}
          pixelated={pixelated}
        />
      </Tile>
      <Tile shifted={grid} position={[23, 10]}>
        <TextPostCard
          link="/stories/thirty-four"
          post={posts[0]!}
          highlight={hl === 'stories'}
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

type CardProps = {
  highlight?: boolean,
  children?: ReactNode,
  onDrag?: () => void,
  onStop?: () => void,
  top?: boolean,
};
function Card({
  children, onDrag, onStop, highlight, top,
}: CardProps) {
  return <>
    <Draggable
      onDrag={onDrag}
      onStop={onStop}
      top={top}
    >
      <div className="container pixel-shadow" style={highlight ? {
        transform: `scale(1.2)`
      } : undefined}>
        <div className="pixel-corners">
          <div className="card-frame">
            {children}
          </div>
        </div>
      </div>
    </Draggable>
    <style jsx>{`
    .container {
      transition: transform .3s;
      display: flex;
      position: relative;
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      padding: 0;
    }
    `}</style>
  </>;
}

function LinkCard({ link, children, ...rest }: CardProps & {
  link: string,
}) {
  let navigable = true;
  function lock() { navigable = false; }
  function unlock() { setTimeout(() => { navigable = true; }) }
  return <>
    <Link draggable={false} href={link}
      onClick={event => {
        if (!navigable)
          event.preventDefault();
      }}
    >
      <Card
        onDrag={lock}
        onStop={unlock}
        {...rest}
      >
        {children}
      </Card>
    </Link>
  </>;
}

function PosterCard({ index, pixelated, highlight }: {
  index: number,
  pixelated: boolean,
  highlight: boolean,
}) {
  return <SketchCard
    link={`/posters/${index}`}
    sketch={posters[index]!}
    highlight={highlight}
    pixelated={pixelated}
  />;
}

function SketchCard({ sketch, pixelated, ...rest }: CardProps & {
  sketch: Scene<any>,
  link: string,
  pixelated: boolean,
}) {
  let u = 20;
  let { node } = useSketcher({
    scene: sketch, period: 40,
    dimensions: pixelated ? [3 * u, 4 * u] : undefined,
  });
  return <div>
    <LinkCard {...rest}>{node}</LinkCard>
  </div>;
}

function TextPostCard({ post, ...rest }: CardProps & {
  post: TextPost,
  link: string,
}) {
  return <LinkCard {...rest}>
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
  </LinkCard>;
}

function AboutCard({ hue, onHover }: {
  hue: number,
  onHover?: (target?: HighlightKind) => void,
}) {
  function TextLink({ children, href, highlight }: {
    href: string,
    children?: ReactNode,
    highlight?: HighlightKind,
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
  return <Card top>
    <div className="content noselect" unselectable="on">
      —Привет! Меня зовут <span>Анҗан</span>. Я пишу <TextLink href='/stories' highlight="stories">рассказы</TextLink> и делаю <TextLink href={`/posters?hue=${hue}`} highlight="posters">постеры</TextLink>.
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