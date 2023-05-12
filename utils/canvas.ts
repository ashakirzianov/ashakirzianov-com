import {
    createElement, createRef, RefObject, useEffect, useRef,
} from "react"

export type UseCanvasesReturn = ReturnType<typeof useCanvases>

type CanvasDimensions = [width: number | undefined, height: number | undefined];
export function useCanvases(dims: CanvasDimensions[]) {
    let refs = useRefArray<HTMLCanvasElement>(dims.length)
    let nodes = dims.map(
        ([width, height], idx) => createElement('canvas', {
            ref: refs[idx],
            key: `layer-${idx}`,
            width: width,
            height: height,
            style: {
                zIndex: idx,
                backgroundColor: 'transparent',
                gridColumn: 1,
                gridRow: 1,
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
            },
        }),
    )

    let node = createElement('div', {
        style: {
            display: 'grid',
            flexGrow: 1,
            padding: 0,
            margin: 0,
            width: '100%',
            height: '100%',
        }
    },
        nodes,
    )

    useEffect(() => {
        for (let ref of refs) {
            if (ref.current && !ref.current.dataset['setup']) {
                setupCanvas(ref.current)
                ref.current.dataset['setup'] = 'true'
            }
        }
    })

    return { node, refs }
}

export function getCanvasFromRef(canvasRef: RefObject<HTMLCanvasElement> | undefined) {
    if (!canvasRef?.current) {
        return undefined
    }
    let context = canvasRef.current.getContext('2d')
    if (!context) {
        return undefined
    }
    return {
        context,
        width: canvasRef.current.width,
        height: canvasRef.current.height,
    }
}

export function setupCanvas(canvas: HTMLCanvasElement) {
    if (canvas.width === undefined || canvas.width === 300) {
        canvas.dataset['autowidth'] = 'true'
    }
    if (canvas.height === undefined || canvas.height === 150) {
        canvas.dataset['autoheight'] = 'true'
    }
    let dpi = window.devicePixelRatio || 1
    // Hack: support safari on old screens
    dpi = Math.max(dpi, 2)
    let style = getComputedStyle(canvas)
    let styleWidth = style.getPropertyValue('width')
    let styleHeight = style.getPropertyValue('height')
    let width = parseInt(styleWidth, 10) * dpi
    let height = parseInt(styleHeight, 10) * dpi
    if (canvas.dataset['autowidth']) {
        canvas.setAttribute('width', width.toString())
    }
    if (canvas.dataset['autoheight']) {
        canvas.setAttribute('height', height.toString())
    }
}

function useRefArray<T>(count: number) {
    let { current: refs } = useRef<Array<RefObject<T>>>([])
    if (refs.length !== count) {
        for (let idx = 0; idx < count; idx++) {
            refs[idx] = refs[idx] ?? createRef()
        }
    }
    return refs
}