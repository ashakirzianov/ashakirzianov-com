import { StartUniverseOut } from "@/sketcher";
import { useEffect } from "react";

export function useSketcher({ sketch, period }: {
    sketch: StartUniverseOut,
    period: number,
}) {
    useEffect(() => {
        let timeout: any;
        function cleanup() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        }
        function loop() {
            sketch.tick();
            cleanup();
            timeout = setTimeout(loop, period);
        }
        loop();
        return cleanup;
    }, []);
    return {
        renderFrame: sketch.renderFrame,
        setupFrame: sketch.setupFrame,
    };
}