import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { posters } from "@/sketches/posters";
import { TextPost, getAllTexts } from "@/texts";
import { Draggable } from "@/components/Draggable";
import Head from "next/head";
import { Press_Start_2P } from '@next/font/google';
const p2p = Press_Start_2P({
  subsets: ['cyrillic-ext'],
  weight: '400',
  variable: '--font-pixel',
});

// @refresh reset

type Props = {
  posts: TextPost[];
  hue: number,
  pixelatedSketches: boolean,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
  let posts = await getAllTexts();
  let hues = [40, 210, 340, 360];
  return {
    props: {
      posts,
      hue: hues[0]!,
      pixelatedSketches: false,
    }
  };
}

type HighlightKind = 'stories' | 'posters';
export default function Main({
  posts, hue, pixelatedSketches,
}: Props) {
  let [hl, setHl] = useState<HighlightKind | undefined>(undefined);
  let [grid, setGrid] = useState(false);
  return <Page hue={hue}>
    <div className={grid ? 'grid' : 'flex'}>
      <div className="card" style={{
        top: '-18vh',
        left: '5vw',
      }}>
        <PosterCard
          index={0}
          highlight={hl === 'posters'}
          pixelated={pixelatedSketches}
        />
      </div>
      <div className="card" style={{
        top: '7vh',
        left: '-17vw',
      }}>
        <PosterCard
          index={1}
          highlight={hl === 'posters'}
          pixelated={pixelatedSketches}
        />
      </div>
      <div className="card" style={{
        top: '15vh',
        left: '-10vw',
      }}>
        <PosterCard
          index={2}
          highlight={hl === 'posters'}
          pixelated={pixelatedSketches}
        />
      </div>
      <div className="card" style={{
        bottom: '-12vh',
        left: '25vw',
      }}>
        <TextPostCard
          link="/stories/thirty-four"
          post={posts[0]!}
          highlight={hl === 'stories'}
        />
      </div>
      <div className="card" style={{
        top: '0vw',
        left: '0vh',
      }}>
        <AboutCard
          onHover={setHl}
        />
      </div>
    </div>
    <style jsx global>{`
      body {
        background-color: hsl(${hue},60%,65%);
      }
      div {
        transition: display 3s;
      }
      `}</style>
    <style jsx>{`
      .card {
        position: ${grid ? 'relative' : 'static'};
        grid-area: mid;
      }
      .grid {
        display: grid;
        grid-template-areas: "mid";
        place-items: center center;
        width: 100%;
        height: 100vh;
      }
      .flex {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        gap: 10pt;
        padding: 10pt;
        width: 100%;
        height: 100vh;
      }
      `}</style>
  </Page>
}

function Page({ hue, children }: {
  hue: number,
  children: ReactNode,
}) {
  return <>
    <Head>
      <title>Анҗан</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main className={`page ${p2p.variable}`}>
      <div className="back">Җ</div>
      <div className="content">{children}</div>
      <style jsx>{`
      .page {
        display: grid;
        grid-template-areas: "mid";
        place-items: center center;
        width: 100%;
        height: 100vh;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        cursor: default;
      }
      .back {
        grid-area: mid;
        font-size: min(80vh,90vw);
        font-family: var(--font-pixel);
        color: hsl(${hue},45%,65%);
      }
      .content {
        grid-area: mid;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100vh;
      }
    `}</style>
    </main>
  </>
}

function Button({ color, onClick, toggle }: {
  color: string,
  onClick: () => void,
  toggle?: boolean,
}) {
  let size = '30px';
  let drop = '8px';
  let [pressed, setPressed] = useState(false);
  let [toggled, setToggled] = useState(false);
  let down = pressed || toggled;
  let left = down ? drop : '0px';
  let top = down ? drop : '0px';
  let filter = down ? 'none' : `drop-shadow(${drop} ${drop} 0px #222)`;
  return <div className="outer">
    <div className="inner pixel-corners"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => { setPressed(false) }}
      onMouseLeave={() => setPressed(false)}
      onClick={() => {
        if (onClick) onClick();
        if (toggle) setToggled(v => !v);
      }}
    />
    <style jsx>{`
    .outer {
      filter: ${filter};
    }
    .inner {
      position: relative;
      top: ${top};
      left: ${left};
      margin: 10px;
      width: ${size};
      height: ${size};
      background-color: ${color};
    }
    .pixel-corners {
      clip-path: polygon(
        0px 9px,
        3px 9px,
        3px 3px,
        6px 3px,
        9px 3px,
        9px 0px,
        calc(100% - 9px) 0px,
        calc(100% - 9px) 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) 6px,
        calc(100% - 3px) 9px,
        100% 9px,
        100% calc(100% - 9px),
        calc(100% - 3px) calc(100% - 9px),
        calc(100% - 3px) calc(100% - 3px),
        calc(100% - 6px) calc(100% - 3px),
        calc(100% - 9px) calc(100% - 3px),
        calc(100% - 9px) 100%,
        9px 100%,
        9px calc(100% - 3px),
        3px calc(100% - 3px),
        3px calc(100% - 6px),
        3px calc(100% - 9px),
        0px calc(100% - 9px)
      );
    }
    `}</style>
  </div>
}

type CardProps = {
  highlight?: boolean,
  children?: ReactNode,
  onDrag?: () => void,
  onStop?: () => void,
};
function Card({ children, onDrag, onStop, highlight }: CardProps) {
  return <>
    <Draggable
      onDrag={onDrag}
      onStop={onStop}
    >
      <div className="container" style={highlight ? {
        transform: `scale(1.2)`
      } : undefined}>
        <div className="pixel-corners">
          <div className={`content ${p2p.className}`}>
            {children}
          </div>
        </div>
      </div>
    </Draggable>
    <style jsx>{`
    .pixel-corners {
      clip-path: polygon(
        0px 9px,
        3px 9px,
        3px 3px,
        6px 3px,
        9px 3px,
        9px 0px,
        calc(100% - 9px) 0px,
        calc(100% - 9px) 3px,
        calc(100% - 3px) 3px,
        calc(100% - 3px) 6px,
        calc(100% - 3px) 9px,
        100% 9px,
        100% calc(100% - 9px),
        calc(100% - 3px) calc(100% - 9px),
        calc(100% - 3px) calc(100% - 3px),
        calc(100% - 6px) calc(100% - 3px),
        calc(100% - 9px) calc(100% - 3px),
        calc(100% - 9px) 100%,
        9px 100%,
        9px calc(100% - 3px),
        3px calc(100% - 3px),
        3px calc(100% - 6px),
        3px calc(100% - 9px),
        0px calc(100% - 9px)
      );
    }
    .container {
      transition: transform .3s;
      display: flex;
      position: relative;
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      padding: 0;
      filter: drop-shadow(10px 10px 0px #222);
    }
    .content {
      display: flex;
      overflow: hidden;
      clip-path: border-box;
      aspect-ratio: 3/4;
      width: min(200px, 50vw);
    }
    `}</style>
  </>;
}

function LinkCard({ link, children, ...rest }: CardProps & {
  link: string,
}) {
  let [navigable, setNavigable] = useState(true);
  return <>
    <Link draggable={false} href={navigable ? link : ''}>
      <Card
        onDrag={() => setNavigable(false)}
        onStop={() => setTimeout(() => setNavigable(true))}
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
    link={`/poster/${index}`}
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
  let [focused, setFocused] = useState(true);
  let u = focused ? 30 : 200;
  let { node } = useSketcher({
    scene: sketch, period: 40,
    dimensions: pixelated ? [3 * u, 4 * u] : undefined,
  });
  return <div
    onMouseOver={() => setFocused(false)}
    onMouseOut={() => setFocused(true)}
    onMouseLeave={() => setFocused(true)}
  >
    <LinkCard {...rest}>{node}</LinkCard>
  </div>;
}

function TextPostCard({ post, ...rest }: CardProps & {
  post: TextPost,
  link: string,
}) {
  return <LinkCard {...rest}>
    <div className="container">
      <div className="post" dangerouslySetInnerHTML={{ __html: post.html }} />
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
        font-size: min(5pt,11.6vw);
        max-height: min(189pt,58vw);
        padding: 3em 5%;
        width: 100%;
        user-select: none;
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

function AboutCard({ onHover }: {
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
  return <Card>
    <div className="content" unselectable="on">
      —Привет! Меня зовут <span>Анҗан</span>. Я пишу <TextLink href='/stories' highlight="stories">рассказы</TextLink> и делаю <TextLink href='/posters' highlight="posters">постеры</TextLink>.
      <p>&nbsp;</p>
      — Что? Кто ты такой и <TextLink href='/about'>что это за буква җ?</TextLink>

      <style jsx>{`
    .content {
      color: var(--foreground-light);
      background-color: var(--paper-light);
      text-indent: 1em;
      color: var(--foreground-light);
      overflow: hidden;
      font-size: 1.4vh;
      line-height: 1.2em;
      padding: 10%;
      width: 100%;
      height: 100%;
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */
      cursor: default;
    }
    span {
      color: var(--foreground-light);
    }
    `}</style>
    </div>
  </Card >;
}