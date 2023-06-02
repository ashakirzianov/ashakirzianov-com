import { Layer } from "./layer"
import { Canvas } from "./render"
import { Scene } from "./scene"

type CanvasKind = Layer['kind']
export type CanvasGetter = (idx: number, kind: CanvasKind) => Canvas<any> | undefined;
export type LaunchProps<State> = {
    scene: Scene<State>,
    getCanvas: CanvasGetter,
    period?: number,
    skip?: number,
    chunk?: number,
};
export type Launcher = ReturnType<typeof launcher>;
export function launcher<State>({
    scene: { state, animator, layers },
    period, skip, chunk,
    getCanvas,
}: LaunchProps<State>) {
    let paused = true
    let timer = makeTimer()
    let frame = 0
    let renderState = makeRenderState({ layers, getCanvas })
    function loop(current?: number) {
        if (animator) {
            state = animator(state, {
                frame,
                getCanvas: i => getCanvas(i, layers[i]!.kind),
            })
        }
        if (renderState(state, frame)) {
            if (period) { // If animated
                if (frame < (skip ?? 0) // Still skiping
                    && (current ?? 0) < (chunk ?? 100)) { // But do it in chunks
                    loop((current ?? 0) + 1)
                } else {
                    timer.schedule(loop, period)
                }
            }
            frame++
        } else { // Try again later if render failed
            timer.schedule(loop, period ?? 0)
        }
    }
    function start() {
        timer.reset()
        paused = false
        loop()
    }
    function pause() {
        timer.reset()
        paused = true
    }
    function isPaused() {
        return paused
    }
    function cleanup() {
        timer.reset()

    }
    return { start, pause, isPaused, cleanup }
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
    }))
    return function renderLayers(state: State, frame: number) {
        let canvases: Canvas<any>[] = []
        for (let idx = 0; idx < layerData.length; idx++) {
            let canvas = getCanvas(idx, layerData[idx]!.layer.kind)
            if (canvas === undefined) {
                return false
            }
            canvases.push(canvas)
            let ld = layerData[idx]!
            if (ld.width !== canvas.width || ld.height !== canvas.height) {
                ld.width = canvas.width
                ld.height = canvas.height
                ld.prepared = false
            }
        }
        for (let idx = 0; idx < layerData.length; idx++) {
            let { layer, prepared } = layerData[idx]!
            if (layer.hidden) {
                continue
            }
            let canvas = canvases[idx]!
            if (!prepared && layer.prepare) {
                canvas.context.resetTransform()
                layer.prepare({ canvas, state, frame: 0 })
                layerData[idx]!.prepared = true
            }
            if (layer.render) {
                layer.render({ canvas, state, frame })
            }
        }
        return true
    }
}

type Timer = ReturnType<typeof makeTimer>;
function makeTimer() {
    let timeout: any
    function schedule(f: () => void, t: number) {
        reset()
        timeout = setTimeout(f, t)
    }
    function reset() {
        if (timeout) {
            clearTimeout(timeout)
            timeout = undefined
        }
    }
    return { schedule, reset }
}