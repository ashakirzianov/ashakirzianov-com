import { RenderFrameFunc } from "@/components/Canvas";
import { StartUniverseOut } from "@/sketcher";
import { useEffect, useLayoutEffect, useRef } from "react";

function noop() { }
export function useSketcher(starter: () => StartUniverseOut) {
    let outRef = useRef<RenderFrameFunc>();
    useEffect(() => {
        let { renderFrame } = starter();
        outRef.current = renderFrame;
    }, []);
    return {
        renderFrame: outRef.current ? outRef.current : noop,
    };
}