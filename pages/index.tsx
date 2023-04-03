import { Draggable, Position } from "@/components/Draggable";
import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";

// @refresh reset

function Sketch({ sketch, offset }: {
  sketch: Scene,
  offset?: Position,
}) {
  let { node } = useSketcher({
    scene: sketch, period: 40,
  });
  return <Draggable position={offset ?? { top: 0, left: 0 }}>
    <div className="sketch">{node}</div>
    <style jsx>{`
    .sketch {
      aspect-ratio: 3/4;
      width: 200pt;
      max-width: 50vw;
      box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.2);
      border-radius: 5px;
    }
    `}</style>
  </Draggable>;
}

export default function Main() {
  return <div className="container">
    <div className="card" style={{
      top: '15vh',
      left: '13vw',
    }}>
      <Sketch
        sketch={loveMeTwoTimes()}
      />
    </div>
    <div className="card" style={{
      bottom: '25vh',
      right: '21vw',
    }}>
      <Sketch
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