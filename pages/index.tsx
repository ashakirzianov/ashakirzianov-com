import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";
import { TextPost, getAllTexts } from "@/texts";
import { Draggable } from "@/components/Draggable";
import { Paper } from "@/components/Paper";
import Head from "next/head";

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
      <div style={{
        position: 'absolute',
        top: '15vh',
        left: '13vw',
      }}>
        <SketchCard
          link="/posters/0"
          sketch={loveMeTwoTimes()}
          highlight={hl === 'posters'}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: '25vh',
        right: '12vw',
      }}>
        <SketchCard
          link="/posters/1"
          sketch={bwway()}
          highlight={hl === 'posters'}
        />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '15vh',
        left: '30vw',
      }}>
        <TextPostCard
          link="/texts/thirty-four"
          post={posts[0]!}
          highlight={hl === 'stories'}
        />
      </div>
      <div style={{
        position: 'absolute',
        top: '10vw',
        right: '30vh',
      }}>
        <AboutCard onHover={setHl} />
      </div>

      <style jsx>{`
      .container {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
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
      onDrag={onDrag}
      onStop={onStop}
    >
      <div className="container" style={highlight ? {
        transform: `scale(1.2)`
      } : undefined}>
        <Paper>
          <div className="content">
            {children}
          </div>
        </Paper>
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
      aspect-ratio: 3/4;
      width: min(192pt,48vw);
      height: 100%;
    }
    .content {
      display: flex;
      border-radius: 8px;
      overflow: hidden;
      clip-path: border-box;
      width: 100%;
      height: 100%;
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
  let { node } = useSketcher({
    scene: sketch, period: 40,
  });
  return <LinkCard {...rest}>{node}</LinkCard>;
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
        background-color: var(--background-light);
        color: var(--foreground-light);
      }
      .post {
        overflow: hidden;
        // font-family: Avenir Next,Helvetics,sans-serif;
        font-size: 5pt;
        padding: 3em 5%;
        width: 100%;
        max-height: min(244pt,58vw);
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
      text-indent: 1em;
        background-color: var(--background);
        color: var(--foreground);
        overflow: hidden;
        font-size: 2.5vh;
        line-height: 1.2em;
        padding: 10%;
        width: 100%;
        height: 100%;
        user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        cursor: default;
    }
    span {
      content: "oops";
      color: skyblue;
    }
    a.link {
      color: skyblue; important
    }
    `}</style>
    </div>
  </Card >;
}