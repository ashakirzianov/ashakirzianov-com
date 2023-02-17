import { Canvas, launch, LaunchProps, Scene } from "@/sketcher";
import { useEffect } from "react";
import { getCanvasFromRef, useCanvases } from "./canvas";

export type GetCanvasFunc = (idx: number) => Canvas | undefined;
export type UseSketcherProps = Omit<LaunchProps, 'getCanvas'>;
export function useSketcher(props: UseSketcherProps) {
    let { node, refs } = useCanvases(props.scene.layers.length);
    useEffect(() => {
        let { cleanup } = launch({
            ...props,
            getCanvas(idx) {
                return getCanvasFromRef(refs[idx]);
            },
        });

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