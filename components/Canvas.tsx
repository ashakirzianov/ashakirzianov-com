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
};
export function Canvas({ renderFrame, fps }: CanvasProps) {
    let canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef.current) return;
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
                    setTimeout(loop, period);
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
    }, [canvasRef.current]);
    return <canvas ref={canvasRef} />;
}