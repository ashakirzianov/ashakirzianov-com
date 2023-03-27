import {
    createElement, createRef, RefObject, useEffect, useRef,
} from "react";

export function useCanvases(count: number): void;
export function useCanvases(dimensions: CanvasDimensions[]): void;
export function useCanvases(arg: number | CanvasDimensions[]) {
    if (typeof arg === 'number') {
        return useCanvasesImpl(Array(arg).fill({
            width: '100%',
            height: '100%',
        }));
    } else {
        return useCanvasesImpl(arg);
    }
}

type CanvasDimensions = {
    width: number | string,
    height: number | string,
};
function useCanvasesImpl(dims: CanvasDimensions[]) {
    let refs = useRefArray<HTMLCanvasElement>(dims.length);
    let nodes = dims.map(
        (dim, idx) => createElement('canvas', {
            ref: refs[idx],
            key: `layer-${idx}`,
            style: {
                zIndex: idx,
                backgroundColor: 'transparent',
                gridColumn: 1,
                gridRow: 1,
                width: dim.width,
                height: dim.height,
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
    let dpi = window.devicePixelRatio || 1;
    let style = getComputedStyle(canvas);
    let styleWidth = style.getPropertyValue('width');
    let styleHeight = style.getPropertyValue('height');
    let width = parseInt(styleWidth, 10) * dpi;
    let height = parseInt(styleHeight, 10) * dpi;
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());
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