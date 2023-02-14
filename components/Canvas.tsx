"use client";
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
    useEffect(() => {
        let stop = false;
        if (animated) {
            let loop = function () {
                if (stop) {
                    // console.log('last draw');
                    draw();
                } else {
                    // console.log('animation');
                    draw(loop);
                }
            }
            loop();
        } else {
            draw();
        }
        return function cleanup() {
            stop = true;
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