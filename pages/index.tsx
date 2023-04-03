import { useSketcher } from "@/hooks/sketcher";
import { Scene } from "@/sketcher";
import { bwway, loveMeTwoTimes } from "@/sketches/posters";
import { variations } from "@/sketches/wip";

// @refresh reset

function useScene(scene: Scene) {
  return useSketcher({
    scene, period: 40,
  }).node;
}

export default function Main() {
  let [
    a, b, c, d, e, f, g, h,
  ] = [
      useScene(loveMeTwoTimes()),
      useScene(bwway()),
      useScene(variations[11]!),
      useScene(variations[10]!),
      useScene(variations[8]!),
      useScene(variations[6]!),
      useScene(variations[4]!),
      useScene(variations[3]!),
    ];
  return <div className="container">
    <div className="main-grid">
      <div className="a">{a}</div>
      <div className="b">{b}</div>
      <div className="c">{c}</div>
      <div className="d">{d}</div>
      <div className="e">{e}</div>
      <div className="f">{f}</div>
      <div className="g">{g}</div>
      <div className="h">{h}</div>
    </div>
    <style jsx>{`
      .container {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
        // background-color: rgb(230,230,230);
      }
      .main-grid {
        aspect-ratio: 15/10;
        max-height: 100%;
        display: grid;
        grid-template-columns: repeat(15,1fr);
        grid-template-rows: repeat(10,1fr);
        grid-template-areas:
          "a a a . . . . . . . . . b b b"
          "a a a . . . c c c . . . b b b"
          "a a a . . . c c c . . . b b b"
          "a a a d d d c c c e e e b b b"
          ". . . d d d c c c e e e . . ."
          ". . . d d d f f f e e e . . ."
          "g g g d d d f f f e e e h h h"
          "g g g . . . f f f . . . h h h"
          "g g g . . . f f f . . . h h h"
          "g g g . . . . . . . . . h h h"
      }
      .a { grid-area: a; }
      .b { grid-area: b; }
      .c { grid-area: c; }
      .d { grid-area: d; }
      .e { grid-area: e; }
      .f { grid-area: f; }
      .g { grid-area: g; }
      .h { grid-area: h; }
      .a, .b, .c, .d, .e, .f, .g, .h {
        display: flex;
        flex: 1;
        justify-self: stretch;
        aligh-self: stretch;
        margin: 2pt;
        box-shadow: 0 2px 6px 0 rgba(0,0,0,.4);
      }
      `}</style>
  </div>;
}