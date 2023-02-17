import { Canvas, Scene } from "@/sketcher";
import { useEffect } from "react";
import { getCanvasFromRef, useCanvases } from "./canvas";

export function useSketcher({
    scene: { universe, animator, layers },
    period,
}: {
    scene: Scene,
    period: number,
}) {
    let { node, refs } = useCanvases(layers.length);
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
            for (let idx = 0; idx < layers.length; idx++) {
                let ref = refs[idx];
                let canvas = getCanvasFromRef(ref);
                if (!canvas) {
                    continue;
                }
                let layer = layers[idx];
                layer.render({ canvas, universe });
            }
            cleanup();
            timeout = setTimeout(loop, period);
        }
        loop();
        return cleanup;
    }, []);
    return { node };
}

export type UseSketcherOut = {
    renderFrame: (canvas: Canvas) => void,
};
export function useSingleLayeredSketcher({
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
            for (let idx = 0; idx < layers.length; idx++) {
                let layer = layers[idx];
                layer.render({ canvas, universe });
            }
        },
    };
}