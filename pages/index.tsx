import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";
import { TextPost, getAllTexts } from "@/texts";
import { Draggable } from "@/components/Draggable";
import Head from "next/head";
import { Press_Start_2P } from '@next/font/google';
const p2p = Press_Start_2P({
  subsets: ['cyrillic-ext'],
  weight: '400',
});

// @refresh reset

type Props = {
  posts: TextPost[];
};
export const getStaticProps: GetStaticProps<Props> = async function () {
  let posts = await getAllTexts();
  return { props: { posts } };
}

type HighlightKind = 'stories' | 'posters';
export default function Main({ posts }: Props) {
  let [hl, setHl] = useState<HighlightKind | undefined>(undefined);
  return <>
    <Head>
      <title>Анҗан</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head><div className="container">
      <div className="card" style={{
        top: '-18vh',
        left: '5vw',
      }}>
        <SketchCard
          link="/posters/0"
          sketch={loveMeTwoTimes()}
          highlight={hl === 'posters'}
        />
      </div>
      <div className="card" style={{
        top: '7vh',
        left: '-15vw',
      }}>
        <SketchCard
          link="/posters/1"
          sketch={bwway()}
          highlight={hl === 'posters'}
        />
      </div>
      <div className="card" style={{
        bottom: '-12vh',
        left: '25vw',
      }}>
        <TextPostCard
          link="/texts/thirty-four"
          post={posts[0]!}
          highlight={hl === 'stories'}
        />
      </div>
      <div className="card" style={{
        top: '0vw',
        left: '0vh',
      }}>
        <AboutCard
        // onHover={setHl}
        />
      </div>

      <style jsx>{`
      .card {
        position: relative;
        grid-area: mid;
      }
      .container {
        display: grid;
        grid-template-areas: "mid";
        place-items: center;
        width: 100%;
        height: 100vh;
      }
      `}</style>
    </div>
  </>;
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
      front={highlight}
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
        0px 8px,
        4px 8px,
        4px 4px,
        8px 4px,
        8px 0px,
        calc(100% - 8px) 0px,
        calc(100% - 8px) 4px,
        calc(100% - 4px) 4px,
        calc(100% - 4px) 8px,
        100% 8px,
        100% calc(100% - 8px),
        calc(100% - 4px) calc(100% - 8px),
        calc(100% - 4px) calc(100% - 4px),
        calc(100% - 8px) calc(100% - 4px),
        calc(100% - 8px) 100%,
        8px 100%,
        8px calc(100% - 4px),
        4px calc(100% - 4px),
        4px calc(100% - 8px),
        0px calc(100% - 8px)
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
      filter: drop-shadow(10px 10px 0px rgba(0,0,0,.9));
    }
    .content {
      display: flex;
      overflow: hidden;
      clip-path: border-box;
      aspect-ratio: 3/4;
      width: min(300px, 50vw);
    }
    `}</style>
  </>;
}

function LinkCard({ link, children, ...rest }: CardProps & {
  link: string,
}) {
  let [navigable, setNavigable] = useState(true);
  return <Link draggable={false} href={navigable ? link : ''}>
    <Card
      onDrag={() => setNavigable(false)}
      onStop={() => setTimeout(() => setNavigable(true))}
      {...rest}
    >
      {children}
    </Card>
  </Link>;
}

function SketchCard({ sketch, ...rest }: CardProps & {
  sketch: Scene,
  link: string,
}) {
  let [pixelated, setPixelated] = useState(true);
  let u = pixelated ? 30 : 200;
  let { node } = useSketcher({
    scene: sketch, period: 40,
    dimensions: [3 * u, 4 * u],
  });
  return <div
    onMouseOver={() => setPixelated(false)}
    onMouseOut={() => setPixelated(true)}
    onMouseLeave={() => setPixelated(true)}
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
      }
      .post {
        overflow: hidden;
        font-size: min(4.8pt,11.6vw);
        max-height: min(290pt,58vw);
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
    return <Link className="link" href={href} legacyBehavior>
      <a className='link'
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
        }}
        style={{
          color: 'skyblue',
        }}>{children}</a>
    </Link>;
  }
  return <Card>
    <div className="content" unselectable="on">
      —Привет! Меня зовут <span>Анҗан</span>. Я пишу <TextLink href='/texts' highlight="stories">рассказы</TextLink> и делаю <TextLink href='/posters' highlight="posters">постеры</TextLink>.
      <p>&nbsp;</p>
      — Что? Кто ты такой и <TextLink href='/about'>что это за буква җ?</TextLink>

      <style jsx>{`
    .content {
      color: var(--foreground-light);
      background-color: var(--paper-light);
      text-indent: 1em;
      color: var(--foreground);
      overflow: hidden;
      font-size: 1.8vh;
      line-height: 1.2em;
      padding: 10%;
      width: 100%;
      height: 100%;
      user-select: none;
      cursor: default;
    }
    span {
      color: skyblue;
    }
    a.link {
      color: skyblue; important
    }
    `}</style>
    </div>
  </Card >;
}