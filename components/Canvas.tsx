// @refresh reset
import {
    RefObject,
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
    setup?: RenderFrameFunc,
    animated?: boolean,
};
export function Canvas({
    renderFrame, setup,
    animated,
}: CanvasProps) {
    function getRenderFrameProps(ref: RefObject<HTMLCanvasElement>): RenderFrameProps | undefined {
        if (canvasRef.current) {
            let context = canvasRef.current.getContext('2d');
            if (context) {
                return {
                    context,
                    width: canvasRef.current.width,
                    height: canvasRef.current.height,
                };
            } else {
                return undefined;
            }
        }
        return undefined;
    }
    let canvasRef = useCanvasRef();
    function draw(next?: () => void) {
        return requestAnimationFrame(() => {
            let props = getRenderFrameProps(canvasRef);
            if (!props) {
                return;
            }
            renderFrame(props);
            if (next) {
                next();
            }
        });
    }
    useEffect(() => {
        if (setup) {
            let props = getRenderFrameProps(canvasRef);
            if (props) {
                setup(props);
            }
        }
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
    });
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
        let style = getComputedStyle(canvas);
        let styleWidth = style.getPropertyValue('width');
        let styleHeight = style.getPropertyValue('height');
        let width = parseInt(styleWidth, 10) * dpi;
        let height = parseInt(styleHeight, 10) * dpi;
        canvas.setAttribute('width', width.toString());
        canvas.setAttribute('height', height.toString());
    }

    let canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) {
            setupCanvas(canvasRef.current);
        }
    }, []);

    return canvasRef;
}