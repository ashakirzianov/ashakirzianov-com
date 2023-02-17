import { Canvas, LaunchProps, launcher, Scene } from "@/sketcher";
import { useEffect } from "react";
import { getCanvasFromRef, useCanvases } from "./canvas";

export function useSketcher<State>(props: LaunchProps<State>) {
    let { node, refs } = useCanvases(props.scene.layers.length);
    useEffect(() => {
        let { launch } = launcher(props);
        let { cleanup } = launch(idx => getCanvasFromRef(refs[idx]));

        return cleanup;
    }, []);
    return { node };
}

export type UseSketcherOut = {
    renderFrame: (canvas: Canvas) => void,
};
export function useSingleLayeredSketcher<State>({
    scene: { state, animator, layers },
    period,
}: {
    scene: Scene<State>,
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
            state = animator(state);
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
                layer.render({ canvas, state });
            }
        },
    };
}