import { Color } from "./color"
import { clearFrame, Render } from "./render"
import { layoutAndRender, TextLayout, TextStyle } from "./text"
export type Layer<State = unknown> = {
    render?: Render<State>,
    prepare?: Render<State>,
    hidden?: boolean,
}

export function staticLayer(render: NonNullable<Layer['prepare']>): Layer {
    return { prepare: render }
}

export function renderLayer(render: NonNullable<Layer['render']>): Layer {
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