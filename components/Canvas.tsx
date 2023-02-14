// @refresh reset
import {
    useEffect, useRef,
} from "react";

export type RenderFrameProps = {
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
};
export type RenderFrameFunc = (props: RenderFrameProps) => void;
export type CanvasProps = {
    renderFrame: RenderFrameFunc,
    animated?: boolean,
};
export function Canvas({
    renderFrame,
    animated,
}: CanvasProps) {
    let canvasRef = useCanvasRef();
    function draw(next?: () => void) {
        return requestAnimationFrame(() => {
            let current = canvasRef.current;
            let context = current?.getContext('2d');
            if (!context || !current) {
                return;
            }
            renderFrame({
                context,
                width: current.width,
                height: current.height,
            });
            if (next) {
                next();
            }
        });
    }
    useEffect(() => {
        let frameHandle = 0;
        if (animated) {
            let loop = function () {
                frameHandle = draw(loop);
            }
            loop();
        } else {
            frameHandle = draw();
        }
        return function cleanup() {
            if (frameHandle) {
                cancelAnimationFrame(frameHandle);
            }
        }
    }, [canvasRef.current]);
    return <>
        <canvas
            className="canvas"
            ref={canvasRef}
        />
        <style jsx>{`
        .canvas {
            width: 100%;
            height: 100%;
        }
        `}</style>
    </>;
}

function useCanvasRef() {
    function setupCanvas(canvas: HTMLCanvasElement) {
        let dpi = window.devicePixelRatio || 1;
        // dpi *= 2;
        let style = getComputedStyle(canvas);
        let styleWidth = style.getPropertyValue('width');
        let styleHeight = style.getPropertyValue('height');
        let width = parseInt(styleWidth, 10) * dpi;
        let height = parseInt(styleHeight, 10) * dpi;
        canvas.setAttribute('width', width.toString());
        canvas.setAttribute('height', height.toString());
        // canvas.getContext('2d')?.scale(dpi, dpi);
    }

    let canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            setupCanvas(canvasRef.current);
        }
    }, [canvasRef.current]);

    return canvasRef;
}