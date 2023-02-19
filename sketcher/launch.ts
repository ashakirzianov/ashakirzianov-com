import { Canvas } from "./draw";
import { Layer, Scene } from "./scene";
import { combineTransforms } from "./render";

export type CanvasGetter = (idx: number) => Canvas | undefined;
export type LaunchProps<State> = {
    scene: Scene<State>,
    period?: number,
    skip?: number,
    chunk?: number,
};
export type Launcher = ReturnType<typeof launcher>;
export function launcher<State>({
    scene: { state, animator, layers },
    period, skip, chunk,
}: LaunchProps<State>) {
    function launch(getCanvas: CanvasGetter) {
        let { schedule, cleanup } = makeTimer();
        let frame = 0;
        let renderState = makeRenderState({ layers, getCanvas });
        function loop(current?: number) {
            state = animator(state);
            if (renderState(state) && frame < (skip ?? 0)) {
                frame++;
                if ((current ?? 0) < (chunk ?? 100)) {
                    loop((current ?? 0) + 1);
                } else {
                    schedule(loop, period ?? 0);
                }
            } else if (period) {
                schedule(loop, period);
            }
        }
        loop();
        return { cleanup };
    }
    return { launch };
}

function makeRenderState<State>({ layers, getCanvas }: {
    layers: Layer<State>[],
    getCanvas: CanvasGetter,
}) {
    let doneStatic = new Set();
    return function renderLayers(state: State) {
        let rendered = false;
        for (let idx = 0; idx < layers.length; idx++) {
            let layer = layers[idx]!;
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
            if (layer.transforms) {
                combineTransforms(...layer.transforms)(layer.render)({ canvas, state })
            } else {
                layer.render({ canvas, state });
            }
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