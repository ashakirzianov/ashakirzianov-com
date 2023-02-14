import { useEffect, useRef } from "react";

export type RenderFrameProps = {
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
};
export type RenderFrameFunc = (props: RenderFrameProps) => void;
export type CanvasProps = {
    renderFrame: RenderFrameFunc,
    fps?: number,
    width: number,
    height: number,
    className?: string,
};
export function Canvas({
    renderFrame, fps, className,
    width, height,
}: CanvasProps) {
    let divRef = useRef<HTMLDivElement>(null);
    let canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        let timeoutId: any = undefined;
        if (!canvasRef.current || !divRef.current) return;
        // let { width, height } = divRef.current.getBoundingClientRect();
        // canvasRef.current.width = width;
        // canvasRef.current.height = height;
        let context = canvasRef.current.getContext('2d');
        if (!context) return;
        if (fps) {
            let period = 1000 / fps;
            let loop = function () {
                requestAnimationFrame(() => {
                    if (!canvasRef.current) return;
                    let context = canvasRef.current.getContext('2d');
                    if (!context) return;
                    renderFrame({
                        context,
                        width: canvasRef.current.width,
                        height: canvasRef.current.height,
                    });
                    if (timeoutId) {
                        // clearTimeout(timeoutId);
                        timeoutId = undefined;
                    }
                    timeoutId = setTimeout(loop, period);
                });
            }
            loop();
        } else {
            renderFrame({
                context,
                width: canvasRef.current.width,
                height: canvasRef.current.height,
            });
        }

        // return function clear() {
        //     if (timeoutId) {
        //         clearTimeout(timeoutId);
        //     }
        // }
    }, [canvasRef.current, divRef.current]);
    return <div ref={divRef} className={className}>
        <canvas
            ref={canvasRef}
            width={width}
            height={height} />
        <style jsx>{`
        canvas {
            border: 1px solid red;
        }
        `}</style>
    </div>;
}