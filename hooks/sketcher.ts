import { LaunchProps, launcher } from "@/sketcher";
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