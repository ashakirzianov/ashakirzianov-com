import { useState } from "react";

export function PixelButton({ color, onClick, pressed }: {
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
  return <div className="outer">
    <div className="inner pixel-corners"
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
      }
      `}</style>
  </div>
}