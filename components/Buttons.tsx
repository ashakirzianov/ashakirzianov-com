import { useState } from "react";

export function PixelButton({ color, onClick, toggle, once }: {
    color: string,
    onClick?: () => void,
    toggle?: boolean,
    once?: boolean,
}) {
    let size = '30px';
    let drop = '8px';
    let [pressed, setPressed] = useState(false);
    let [toggled, setToggled] = useState(false);
    let [clicked, setClicked] = useState(false);
    let down = pressed || toggled;
    let left = down ? drop : '0px';
    let top = down ? drop : '0px';
    let filter = down ? 'none' : `drop-shadow(${drop} ${drop} 0px #222)`;
    return <div className="outer">
        <div className="inner pixel-corners"
            onMouseDown={() => setPressed(true)}
            onTouchStart={() => setPressed(true)}
            onMouseUp={() => { setPressed(false) }}
            onTouchEnd={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            onTouchCancel={() => setPressed(false)}
            onClick={() => {
                if (onClick && (!once || !clicked)) onClick();
                if (toggle) setToggled(v => once ? true : !v);
                setClicked(true);
            }}
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