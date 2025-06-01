'use client'
import { href } from "@/utils/refs"
import Link from "next/link"
import { ReactNode, use, useState } from "react"

export type Language = 'ru' | 'en'

export function HomeButton({ language, hue }: {
  language?: Language
  hue: number | undefined,
}) {
  let text = language === 'en' ? 'Home' : 'Главная'
  return <Link href={href('home', { hue })} draggable={false}>
    <PixelButton color="skyblue">{text}</PixelButton>
  </Link>
}

export function AllSketchesButton({ language, hue }: {
  language?: Language
  hue: number | undefined,
}) {
  let text = language === 'en' ? 'All sketches' : 'Все скетчи'
  return <Link href={href('sketch', { hue })} draggable={false}>
    <PixelButton color="skyblue">{text}</PixelButton>
  </Link>
}

export function AllStoriesButton({ language, hue }: {
  language?: Language
  hue: number | undefined,
}) {
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
  return <div draggable={false} style={{
    filter, width,
  }}>
    <div className="flex p-stn font-pixel verti pixel-corners" draggable={false}
      style={{
        position: 'relative',
        top, left,
        backgroundColor: color,
        color: textColor ?? 'white',
      }}
      onMouseDown={() => setPushed(true)}
      onTouchStart={() => setPushed(true)}
      onMouseUp={() => { setPushed(false) }}
      onTouchEnd={() => setPushed(false)}
      onMouseLeave={() => setPushed(false)}
      onTouchCancel={() => setPushed(false)}
      onClick={onClick}
    >{children}</div>
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
  return <div draggable={false} style={{
    filter,
  }}>
    <div className="font-pixel pixel-corners" draggable={false}
      style={{
        position: 'relative',
        top, left,
        width: size,
        height: size,
        backgroundColor: color,
      }}
      onMouseDown={() => setPushed(true)}
      onTouchStart={() => setPushed(true)}
      onMouseUp={() => { setPushed(false) }}
      onTouchEnd={() => setPushed(false)}
      onMouseLeave={() => setPushed(false)}
      onTouchCancel={() => setPushed(false)}
      onClick={onClick}
    />
  </div>
}