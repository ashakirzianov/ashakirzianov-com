import { Canvas } from "./render";
import { Layer, Scene } from "./scene";
import { combineTransforms } from "./transform";

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
    let prepared = false;
    return function renderLayers(state: State) {
        let canvases: Canvas[] = [];
        for (let idx = 0; idx < layers.length; idx++) {
            let canvas = getCanvas(idx);
            if (canvas === undefined) {
                return false;
            }
            canvases.push(canvas);
        }
        for (let idx = 0; idx < layers.length; idx++) {
            let layer = layers[idx]!;
            if (layer.hidden) {
                continue;
            }
            let canvas = canvases[idx]!;
            if (!prepared && layer.prepare) {
                layer.prepare({ canvas, state });
            }
            if (layer.render) {
                if (layer.transforms) {
                    combineTransforms(...layer.transforms)(layer.render)({ canvas, state })
                } else {
                    layer.render({ canvas, state });
                }
            }
        }
        prepared = true;
        return true;
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