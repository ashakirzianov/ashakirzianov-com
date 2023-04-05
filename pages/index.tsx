import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";
import { TextPost, getAllTexts } from "@/texts";
import { Draggable } from "@/components/Draggable";
import { Paper } from "@/components/Paper";

// @refresh reset

type Props = {
  posts: TextPost[];
};
export const getStaticProps: GetStaticProps<Props> = async function () {
  let posts = await getAllTexts();
  return { props: { posts } };
}

export default function Main({ posts }: Props) {
  return <div className="container">
    <div className="card" style={{
      top: '15vh',
      left: '13vw',
    }}>
      <SketchCard
        link="/posters/0"
        sketch={loveMeTwoTimes()}
      />
    </div>
    <div className="card" style={{
      top: '25vh',
      right: '12vw',
    }}>
      <SketchCard
        link="/posters/1"
        sketch={bwway()}
      />
    </div>
    <div className="card" style={{
      bottom: '15vh',
      left: '30vw',
    }}>
      <TextPostCard
        link="/texts/thirty-four"
        post={posts[0]!}
      />
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
      .card {
        position: absolute;
      }
      `}</style>
  </div>;
}

function Card({ children, link }: {
  children: ReactNode,
  link: string,
}) {
  let [navigable, setNavigable] = useState(true);
  return <>
    <Link href={navigable ? link : ''} draggable={false}>
      <Draggable
        onDrag={() => setNavigable(false)}
        onStop={() => setTimeout(() => setNavigable(true))}
      >
        <div className="container">
          <Paper>
            <div className="content">
              {children}
            </div>
          </Paper>
        </div>
      </Draggable>
    </Link>
    <style jsx>{`
    .container {
      display: flex;
      position: relative;
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      aspect-ratio: 3/4;
      width: min(200pt,50vw);
      height: 100%;
    }
    .content {
      display: flex;
      border-radius: 5px;
      overflow: hidden;
      clip-path: border-box;
      width: 100%;
      height: 100%;
    }
    `}</style>
  </>;
}

function SketchCard({ sketch, link }: {
  sketch: Scene,
  link: string,
}) {
  let { node } = useSketcher({
    scene: sketch, period: 40,
  });
  return <Card link={link}>{node}</Card>;
}

function TextPostCard({ post, link }: {
  post: TextPost,
  link: string,
}) {
  return <Card link={link}>
    <div className="container">
      <div className="post" dangerouslySetInnerHTML={{ __html: post.html }} />
      <style jsx>{`
      .container {
        display: flex;
        justify-content: center;
        align-items: start;
        height: 100%;
        width: 100%;
        background-color: rgb(230,230,230);
      }
      .post {
        overflow: hidden;
        font-family: Avenir Next,Helvetics,sans-serif;
        font-size: 5pt;
        padding: 3em 5%;
        width: 100%;
        max-height: min(50em,64vw);
        user-select: none;
      }
      `}</style>
      <style>{`
      h1 {
          margin-bottom: 1em;
      }
      p {
          text-indent: 2em;
          line-height: 1.2em;
          margin-bottom: 1em;
      }
    `}</style>
    </div>
  </Card>;
}