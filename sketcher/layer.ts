import { Color } from "./color"
import { Canvas3DContext, clearFrame, Render } from "./render"
import { layoutAndRender, TextLayout, TextStyle } from "./text"
export type Layer<State = unknown> = Layer2d<State> | Layer3d<State>

type Layer2d<State = unknown> = {
    kind?: '2d',
    render?: Render<State>,
    prepare?: Render<State>,
    hidden?: boolean,
}
type Layer3d<State = unknown> = {
    kind: '3d',
    render?: Render<State, Canvas3DContext>,
    prepare?: Render<State, Canvas3DContext>,
    hidden?: boolean,
}

export function staticLayer(render: NonNullable<Layer2d['prepare']>): Layer2d {
    return { prepare: render }
}

export function renderLayer(render: NonNullable<Layer2d['render']>): Layer2d {
    return { render }
}

export function colorLayer(color: Color): Layer {
    return {
        prepare({ canvas }) {
            clearFrame({ canvas, color })
        }
    }
}

export function layoutLayer(layout: TextLayout, style?: TextStyle): Layer {
    return {
        prepare({ canvas }) {
            layoutAndRender({ canvas, root: layout, style })
        }
    }
}