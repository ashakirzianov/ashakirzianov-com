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
    let layerData = layers.map(layer => ({
        layer,
        prepared: false,
        width: 0,
        height: 0,
    }));
    return function renderLayers(state: State) {
        let canvases: Canvas[] = [];
        for (let idx = 0; idx < layerData.length; idx++) {
            let canvas = getCanvas(idx);
            if (canvas === undefined) {
                return false;
            }
            canvases.push(canvas);
            let ld = layerData[idx]!;
            if (ld.width !== canvas.width || ld.height !== canvas.height) {
                ld.width = canvas.width;
                ld.height = canvas.height;
                ld.prepared = false;
            }
        }
        for (let idx = 0; idx < layerData.length; idx++) {
            let { layer, prepared } = layerData[idx]!;
            if (layer.hidden) {
                continue;
            }
            let canvas = canvases[idx]!;
            if (!prepared && layer.prepare) {
                canvas.context.resetTransform();
                layer.prepare({ canvas, state });
                layerData[idx]!.prepared = true;
            }
            if (layer.render) {
                if (layer.transforms) {
                    combineTransforms(...layer.transforms)(layer.render)({ canvas, state })
                } else {
                    layer.render({ canvas, state });
                }
            }
        }
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