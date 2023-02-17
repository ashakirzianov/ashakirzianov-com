import { Scene, Canvas, Layer, Universe } from "./base";

export type CanvasGetter = (idx: number) => Canvas | undefined;
export type LaunchProps = {
    scene: Scene,
    period: number,
    skip?: number,
    chunk?: number,
};
export type Launcher = ReturnType<typeof launcher>;
export function launcher({
    scene: { universe, animator, layers },
    period, skip, chunk,
}: LaunchProps) {
    function launch(getCanvas: CanvasGetter) {
        let { schedule, cleanup } = makeTimer();
        let frame = 0;
        let renderUniverse = makeRenderUniverse({ layers, getCanvas });
        function loop(current?: number) {
            universe = animator(universe);
            if (renderUniverse(universe) && frame < (skip ?? 0)) {
                frame++;
                if ((current ?? 0) < (chunk ?? 100)) {
                    loop((current ?? 0) + 1);
                } else {
                    schedule(loop, period);
                }
            } else {
                schedule(loop, period);
            }
        }
        loop();
        return { cleanup };
    }
    return { launch };
}

function makeRenderUniverse({ layers, getCanvas }: {
    layers: Layer[],
    getCanvas: CanvasGetter,
}) {
    let doneStatic = new Set();
    return function renderLayers(universe: Universe) {
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
        return rendered;
    }
}

function makeTimer() {
    let timeout: any;
    function schedule(f: () => void, t: number) {
        cleanup();
        timeout = setTimeout(f, t);
    }
    function cleanup() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
    }
    return { schedule, cleanup };
}