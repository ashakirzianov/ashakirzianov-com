import { Canvas, Scene } from "@/sketcher";
import { useEffect } from "react";

export type UseSketcherOut = {
    renderFrame: (canvas: Canvas) => void,
    setupFrame?: (canvas: Canvas) => void,
};
export function useSketcher({
    scene: { universe, animator, layers },
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
            for (let idx = 1; idx < layers.length; idx++) {
                let layer = layers[idx];
                layer.render({ canvas, universe });
            }
        },
        setupFrame(canvas) {
            let layer = layers[0];
            if (layer) {
                layer.render({ canvas, universe });
            }
        },
    };
}