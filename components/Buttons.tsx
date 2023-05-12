import { useQuery } from "@/utils/query"
import { href } from "@/utils/refs"
import Link from "next/link"
import { ReactNode, useState } from "react"

export type Language = 'ru' | 'en'

export function HomeButton({ language }: {
  language?: Language
}) {
  let { hue } = useQuery()
  let text = language === 'en' ? 'Home' : 'Главная'
  return <Link href={href('home', { hue })} draggable={false}>
    <PixelButton color="skyblue">{text}</PixelButton>
  </Link>
}

export function AllSketchesButton({ language }: {
  language?: Language
}) {
  let { hue } = useQuery()
  let text = language === 'en' ? 'All sketches' : 'Все скетчи'
  return <Link href={href('sketch', { hue })} draggable={false}>
    <PixelButton color="skyblue">{text}</PixelButton>
  </Link>
}

export function AllStoriesButton({ language }: {
  language?: Language
}) {
  let { hue } = useQuery()
  let text = language === 'en' ? 'All stories' : 'Все рассказы'
  let id = language === 'en' ? 'en' : undefined
  return <Link href={href('text', { hue, id })}>
    <PixelButton color="skyblue">{text}</PixelButton>
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
  let drop = '8px'
  let [pushed, setPushed] = useState(false)
  let down = pushed
  let left = down ? drop : '0px'
  let top = down ? drop : '0px'
  let filter = down ? 'none' : `drop-shadow(${drop} ${drop} 0px #222)`
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
  let size = '30px'
  let drop = '8px'
  let [pushed, setPushed] = useState(false)
  let down = pushed || pressed
  let left = down ? drop : '0px'
  let top = down ? drop : '0px'
  let filter = down ? 'none' : `drop-shadow(${drop} ${drop} 0px #222)`
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