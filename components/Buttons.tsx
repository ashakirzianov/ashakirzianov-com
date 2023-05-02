import { useQuery } from "@/utils/query";
import { href } from "@/utils/refs";
import Link from "next/link";
import { ReactNode, useState } from "react";

export function HomeButton() {
  let { hue } = useQuery();
  return <Link href={href('home', { hue })} draggable={false}>
    <PixelButton color="skyblue">Главная</PixelButton>
  </Link>
}

export function AllSketchesButton() {
  let { hue } = useQuery();
  return <Link href={href('sketch', { hue })} draggable={false}>
    <PixelButton color="skyblue">Все скетчи</PixelButton>
  </Link>
}

export function AllStoriesButton() {
  return <Link href={href('text')}>
    <PixelButton color="skyblue">Все рассказы</PixelButton>
  </Link>
}

export function PixelButton({
  children, color, textColor, onClick, width
}: {
  color: string,
  children?: ReactNode,
  width?: string,
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
    >{children}</div>
    <style jsx>{`
      .outer {
        filter: ${filter};
        ${width ? `width: ${width}` : ''}
      }
      .inner {
        display: flex;
        position: relative;
        top: ${top};
        left: ${left};
        padding: var(--padding);
        vertical-align: center;
        align-items: center;
        justify-content: center;
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