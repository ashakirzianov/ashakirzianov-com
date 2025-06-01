'use client'
import { ReactNode } from "react"

export function PixelPage({ hue, children }: {
    hue: number | undefined,
    children: ReactNode,
}) {
    return <PixelPageImpl hue={hue ?? 40}>
        {children}
    </PixelPageImpl>
}

function PixelPageImpl({ hue, children }: {
    hue: number,
    children: ReactNode,
}) {
    return <div
        className="grid w-screen h-screen max-h-screen select-none cursor-default font-pixel place-items-start"
        style={{
            gridTemplateAreas: '"mid"',
            backgroundColor: `hsl(${hue},60%,65%)`,
        }}>
        <div className="flex justify-center items-center w-screen h-screen max-h-screen"
            style={{
                gridArea: 'mid',
                fontSize: 'min(80vh,90vw)',
                color: `hsl(${hue},45%,65%)`,
            }}>Җ</div>
        <div className="flex flex-col w-full min-h-screen"
            style={{
                gridArea: 'mid',
            }}>{children}</div>
        <style>{`
        body {
            background-color: hsl(${hue},60%,65%);
        }
      `}</style>
    </div>
}