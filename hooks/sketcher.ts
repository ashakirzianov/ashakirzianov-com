import { Canvas, Scene } from "@/sketcher";
import { useEffect } from "react";

export type UseSketcherOut = {
    renderFrame: (canvas: Canvas) => void,
    setupFrame?: (canvas: Canvas) => void,
};
export function useSketcher({
    scene: { universe, animator, setupFrame, renderFrame },
    period,
}: {
    scene: Scene,
    period: number,
}): UseSketcherOut {
    useEffect(() => {
        let timeout: any;
        function cleanup() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        }
        function loop() {
            universe = animator(universe);
            cleanup();
            timeout = setTimeout(loop, period);
        }
        loop();
        return cleanup;
    }, []);
    return {
        renderFrame(canvas) {
            renderFrame({ canvas, universe });
        },
        setupFrame(canvas) {
            if (setupFrame) {
                setupFrame({ canvas, universe });
            }
        },
    };
}