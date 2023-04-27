import { LaunchProps, launcher } from "@/sketcher";
import { useEffect } from "react";
import { getCanvasFromRef, useCanvases } from "./canvas";

export function useSketcher<State>(props: LaunchProps<State> & {
    dimensions?: [width: number, height: number],
}) {
    let dims = Array(props.scene.layers.length).fill(props.dimensions ?? props.scene.dimensions ?? [undefined, undefined]);
    let { node, refs } = useCanvases(dims);
    useEffect(() => {
        let { launch } = launcher(props);
        let { cleanup } = launch(idx => getCanvasFromRef(refs[idx]));

        return cleanup;
    }, []);
    return { node };
}