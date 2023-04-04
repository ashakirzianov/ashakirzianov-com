import { ReactNode, useState } from "react";
import Link from "next/link";
import { GetStaticProps } from "next";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";
import { TextPost, getAllTexts } from "@/texts";
import { Draggable } from "@/components/Draggable";

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
  return <div>
    <Link href={navigable ? link : ''} draggable={false}>
      <Draggable
        onDrag={() => setNavigable(false)}
        onStop={() => setTimeout(() => setNavigable(true))}
      >
        <div className="container handle">
          <div className="sketch">{children}</div>
        </div>
      </Draggable>
    </Link>
    <style jsx>{`
      .sketch {
        overflow: hidden;
        border-radius: 5px;
        clip-path: border-box;
      }
    .container {
      position: relative;
      display: flex;
      justify-content: stretch;
      align-items: stretch;
      padding: 0;
      aspect-ratio: 3/4;
      width: 200pt;
      max-width: 50vw;
      box-shadow:
        0 2.8px 2.2px rgba(0, 0, 0, 0.034),
        0 6.7px 5.3px rgba(0, 0, 0, 0.048),
        0 12.5px 10px rgba(0, 0, 0, 0.06),
        0 22.3px 17.9px rgba(0, 0, 0, 0.072),
        0 41.8px 33.4px rgba(0, 0, 0, 0.086),
        0 100px 80px rgba(0, 0, 0, 0.12);
      border-radius: 5px;
    }
    `}</style>
  </div>;
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
      <div className="post">
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
      <style>{`
    .container {
        aspect-ratio: 3/4;
        display: flex;
        justify-content: center;
        align-items: start;
        font-family: Avenir Next,Helvetics,sans-serif;
        font-size: 5pt;
        padding: 10pt;
        padding-top: 15pt;
        width: 100%;
        max-height: 100%;
        background-color: rgb(230,230,230);
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .post {
      max-height: 48em;
      overflow: hidden;
    }
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