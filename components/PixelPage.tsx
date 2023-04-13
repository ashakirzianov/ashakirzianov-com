import { ReactNode } from "react";

export function PixelPage({ hue, children }: {
  hue: number,
  children: ReactNode,
}) {
  return <>
    <div className="page">
      <div className="back">Җ</div>
      <div className="content">{children}</div>
    </div>
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
          font-family: var(--font-pixel);
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
    <style jsx global>{`
        body {
            background-color: hsl(${hue},60%,65%);
        }
      `}</style>
  </>
}