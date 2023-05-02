import { LaunchProps, launcher } from "@/sketcher";
import { useEffect } from "react";
import { getCanvasFromRef, useCanvases } from "./canvas";

type UseSketcherProps<S> = Omit<LaunchProps<S>, 'getCanvas'>;
export function useSketcher<State>(props: UseSketcherProps<State> & {
    dimensions?: [width: number, height: number],
}) {
    let dims = Array(props.scene.layers.length).fill(props.dimensions ?? props.scene.dimensions ?? [undefined, undefined]);
    let { node, refs } = useCanvases(dims);
    useEffect(() => {
        let { start, cleanup } = launcher({
            ...props,
            getCanvas: idx => getCanvasFromRef(refs[idx]),
        });
        start();

        return cleanup;
    }, []);
    return { node };
}