import { useState } from "react";

export function PixelButton({
  text, color, textColor, onClick,
}: {
  text: string,
  color: string,
  textColor?: string
  onClick?: () => void,
}) {
  let drop = '8px';
  let [pushed, setPushed] = useState(false);
  let down = pushed;
  let left = down ? drop : '0px';
  let top = down ? drop : '0px';
  let filter = down ? 'none' : `drop-shadow(${drop} ${drop} 0px #222)`;
  return <div className="outer" draggable={false}>
    <div className="inner pixel-corners" draggable={false}
      onMouseDown={() => setPushed(true)}
      onTouchStart={() => setPushed(true)}
      onMouseUp={() => { setPushed(false) }}
      onTouchEnd={() => setPushed(false)}
      onMouseLeave={() => setPushed(false)}
      onTouchCancel={() => setPushed(false)}
      onClick={onClick}
    >{text}</div>
    <style jsx>{`
      .outer {
        filter: ${filter};
      }
      .inner {
        display: flex;
        position: relative;
        top: ${top};
        left: ${left};
        height: 2em;
        padding: 10pt;
        align-items: center;
        color: ${textColor ?? 'white'};
        background-color: ${color};
        font-family: var(--font-pixel), serif;
      }
      `}</style>
  </div>
}

export function PixelToggle({ color, onClick, pressed }: {
  color: string,
  onClick?: () => void,
  pressed?: boolean,
}) {
  let size = '30px';
  let drop = '8px';
  let [pushed, setPushed] = useState(false);
  let down = pushed || pressed;
  let left = down ? drop : '0px';
  let top = down ? drop : '0px';
  let filter = down ? 'none' : `drop-shadow(${drop} ${drop} 0px #222)`;
  return <div className="outer" draggable={false}>
    <div className="inner pixel-corners" draggable={false}
      onMouseDown={() => setPushed(true)}
      onTouchStart={() => setPushed(true)}
      onMouseUp={() => { setPushed(false) }}
      onTouchEnd={() => setPushed(false)}
      onMouseLeave={() => setPushed(false)}
      onTouchCancel={() => setPushed(false)}
      onClick={onClick}
    />
    <style jsx>{`
      .outer {
        filter: ${filter};
      }
      .inner {
        position: relative;
        top: ${top};
        left: ${left};
        width: ${size};
        height: ${size};
        background-color: ${color};
        font-family: var(--font-pixel), serif;
      }
      `}</style>
  </div>
}