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
    width: number,
    height: number,
    className?: string,
};
export function Canvas({
    renderFrame, className,
    width, height, animated,
}: CanvasProps) {
    let divRef = useRef<HTMLDivElement>(null);
    let canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        function draw(next?: () => void) {
            requestAnimationFrame(() => {
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
        if (animated) {
            let loop = function () {
                draw(loop);
            }
            loop();
        } else {
            draw();
        }
    }, [canvasRef.current, divRef.current]);
    return <div ref={divRef} className={className}>
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
        />
    </div>;
}