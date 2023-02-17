import { Scene, Canvas } from "./base";

export type LaunchProps = {
    scene: Scene,
    period: number,
    getCanvas: (idx: number) => Canvas | undefined,
    skip?: number,
    chunk?: number,
};
export function launch({
    scene: { universe, animator, layers },
    getCanvas,
    period, skip, chunk,
}: LaunchProps) {
    let timeout: any;
    function cleanup() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
    }

    let frame = 0;
    let doneStatic = new Set();
    function loop(current?: number) {
        universe = animator(universe);
        let rendered = false;
        for (let idx = 0; idx < layers.length; idx++) {
            let layer = layers[idx];
            if (layer.hidden) {
                continue;
            }
            if (layer.static && doneStatic.has(idx)) {
                continue;
            }
            let canvas = getCanvas(idx);
            if (!canvas) {
                continue;
            }
            layer.render({ canvas, universe });
            if (layer.static) {
                doneStatic.add(idx);
            }
            rendered = true;
        }
        if (rendered) {
            frame++;
        }
        if (frame < (skip ?? 0)) {
            if ((current ?? 0) < (chunk ?? 100)) {
                loop((current ?? 0) + 1);
            } else {
                cleanup();
                timeout = setTimeout(loop, period);
            }
        } else {
            cleanup();
            timeout = setTimeout(loop, period);
        }
        return rendered;
    }
    loop();
    return { cleanup };
}