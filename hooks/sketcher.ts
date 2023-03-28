import { LaunchProps, launcher } from "@/sketcher";
import { useEffect } from "react";
import { getCanvasFromRef, useCanvases } from "./canvas";

export function useSketcher<State>(props: LaunchProps<State>) {
    let dims = Array(props.scene.layers.length).fill(props.scene.dimensions ?? [undefined, undefined]);
    let { node, refs } = useCanvases(dims);
    useEffect(() => {
        let { launch } = launcher(props);
        let { cleanup } = launch(idx => getCanvasFromRef(refs[idx]));

        return cleanup;
    }, []);
    return { node };
}