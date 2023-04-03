import { Draggable, Position } from "@/components/Draggable";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";
import { useRouter } from "next/router";
import { ReactNode } from "react";

// @refresh reset

export default function Main() {
  return <div className="container">
    <div className="card" style={{
      top: '15vh',
      left: '13vw',
    }}>
      <Sketch
        link="/posters/0"
        sketch={loveMeTwoTimes()}
      />
    </div>
    <div className="card" style={{
      bottom: '25vh',
      right: '21vw',
    }}>
      <Sketch
        link="/posters/1"
        sketch={bwway()}
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

function Post({ children, offset, link }: {
  children: ReactNode,
  link: string,
  offset?: Position,
}) {
  let router = useRouter();
  return <>
    <Draggable
      position={offset ?? { top: 0, left: 0 }}
      onClick={() => router.push(link)}
      cursor="pointer"
    >
      <div className="sketch">{children}</div>
      <style jsx>{`
    .sketch {
      aspect-ratio: 3/4;
      width: 200pt;
      max-width: 50vw;
      box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.2);
      border-radius: 5px;
    }
    `}</style>
    </Draggable>
  </>;
}

function Sketch({ sketch, link }: {
  sketch: Scene,
  link: string,
}) {
  let { node } = useSketcher({
    scene: sketch, period: 40,
  });
  return <Post link={link}>{node}</Post>;
}