import { Animator } from "./animator";
import { Color } from "./color";
import { Canvas, clearFrame, Render } from "./render";
import { layoutAndRender, TextLayout, TextStyle } from "./text";
export type Layer<State = unknown> = {
    render?: Render<State>,
    prepare?: Render<State>,
    hidden?: boolean,
}
export type Scene<State = unknown> = {
    state: State,
    animator?: Animator<State>,
    layers: Layer<State>[],
};

export type DrawObjectProps<O> = {
    canvas: Canvas,
    frame: number,
    object: O,
    seti: number,
    index: number,
};
export type DrawObject<O> = (props: DrawObjectProps<O>) => void;
type State<O> = O[][];
export function setsScene<O>({
    sets, animator, drawObject, prepare, prerender, background,
}: {
    sets: O[][],
    animator: Animator<O[][]>,
    drawObject: DrawObject<O>,
    prepare?: Render<O[][]>,
    prerender?: Render<O[][]>,
    background?: {
        prepare?: Render<O[][]>,
        render?: Render<O[][]>,
    },
}): Scene<State<O>> {
    return {
        state: sets,
        animator,
        layers: [background ?? {}, {
            prepare({ canvas, state, frame }) {
                if (prepare) {
                    prepare({ canvas, state, frame });
                }
            },
            render({ canvas, state, frame }) {
                canvas.context.save();
                if (prerender) {
                    prerender({ canvas, state, frame });
                }
                for (let seti = 0; seti < state.length; seti++) {
                    let set = state[seti]!;
                    for (let index = 0; index < set.length; index++) {
                        let object = set[index]!;
                        drawObject({
                            canvas, frame, object, seti, index,
                        });
                    }
                }
                canvas.context.restore();
            }
        }],
    };
}

export function combineScenes(...scenes: Scene<any>[]): Scene {
    let result: Scene<unknown[]> = {
        state: scenes.map(s => s.state),
        animator(states: any[]) {
            return states.map((state, idx) => {
                let animator = scenes[idx]?.animator;
                return animator ? animator(state) : state;
            });
        },
        layers: scenes.map((scene, idx) => {
            return scene.layers.map((layer): Layer<unknown[]> => {
                return {
                    hidden: layer.hidden,
                    prepare({ canvas, frame, state }) {
                        if (layer.prepare) {
                            layer.prepare({
                                canvas, frame,
                                state: state[idx]!,
                            });
                        }
                    },
                    render({ canvas, frame, state }) {
                        if (layer.render) {
                            layer.render({
                                canvas, frame,
                                state: state[idx]!,
                            });
                        }
                    },
                };
            });
        }).flat(),
    };
    return result as Scene;
}

export function fromLayers(...layers: Layer<unknown>[]): Scene<unknown> {
    return {
        state: undefined,
        layers,
    };
}

export function staticLayer(render: NonNullable<Layer['prepare']>): Layer {
    return { prepare: render };
}

export function renderLayer(render: NonNullable<Layer['render']>): Layer {
    return { render };
}

export function colorLayer(color: Color): Layer {
    return {
        prepare({ canvas }) {
            clearFrame({ canvas, color });
        }
    };
}

export function layoutLayer(layout: TextLayout, style?: TextStyle): Layer {
    return {
        prepare({ canvas }) {
            layoutAndRender({ canvas, root: layout, style });
        }
    };
}