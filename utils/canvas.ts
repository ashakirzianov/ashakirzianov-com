import {
    createElement, createRef, RefObject, useEffect, useRef,
} from "react";

export type UseCanvasesReturn = ReturnType<typeof useCanvasesImpl>;
export function useCanvases(count: number): UseCanvasesReturn;
export function useCanvases(dimensions: CanvasDimensions[]): UseCanvasesReturn;
export function useCanvases(arg: number | CanvasDimensions[]) {
    if (typeof arg === 'number') {
        return useCanvasesImpl(Array(arg).fill({
            width: undefined,
            height: undefined,
        }));
    } else {
        return useCanvasesImpl(arg);
    }
}

type CanvasDimensions = [width: number | undefined, height: number | undefined];
function useCanvasesImpl(dims: CanvasDimensions[]) {
    let refs = useRefArray<HTMLCanvasElement>(dims.length);
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
    );

    let node = createElement('div', {
        children: nodes,
        style: {
            display: 'grid',
            flexGrow: 1,
            padding: 0,
            margin: 0,
            width: '100%',
            height: '100%',
        }
    });

    useEffect(() => {
        for (let ref of refs) {
            if (ref.current && !ref.current.dataset['setup']) {
                setupCanvas(ref.current);
                ref.current.dataset['setup'] = 'true';
            }
        }
    });

    return { node, refs };
}

export function getCanvasFromRef(canvasRef: RefObject<HTMLCanvasElement> | undefined) {
    if (!canvasRef?.current) {
        return undefined;
    }
    let context = canvasRef.current.getContext('2d');
    if (!context) {
        return undefined;
    }
    return {
        context,
        width: canvasRef.current.width,
        height: canvasRef.current.height,
    };
}

export function setupCanvas(canvas: HTMLCanvasElement) {
    if (canvas.width === undefined || canvas.width === 300) {
        canvas.dataset['autowidth'] = 'true';
    }
    if (canvas.height === undefined || canvas.height === 150) {
        canvas.dataset['autoheight'] = 'true';
    }
    let dpi = window.devicePixelRatio || 1;
    let style = getComputedStyle(canvas);
    let styleWidth = style.getPropertyValue('width');
    let styleHeight = style.getPropertyValue('height');
    let width = parseInt(styleWidth, 10) * dpi;
    let height = parseInt(styleHeight, 10) * dpi;
    if (canvas.dataset['autowidth']) {
        canvas.setAttribute('width', width.toString());
    }
    if (canvas.dataset['autoheight']) {
        canvas.setAttribute('height', height.toString());
    }
}

function useRefArray<T>(count: number) {
    let { current: refs } = useRef<Array<RefObject<T>>>([]);
    if (refs.length !== count) {
        for (let idx = 0; idx < count; idx++) {
            refs[idx] = refs[idx] ?? createRef();
        }
    }
    return refs;
}