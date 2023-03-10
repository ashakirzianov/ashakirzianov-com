import { Animator } from "./animator";
import { Color, ColorStop, resolveColor } from "./color";
import { Canvas, Render } from "./render";
export type Layer<State> = {
    render?: Render<State>,
    prepare?: Render<State>,
    hidden?: boolean,
}
export type Scene<State = undefined> = {
    state: State,
    animator?: Animator<State>,
    layers: Layer<State>[],
};

// TODO: remove this utils?
export function scene<State>(s: Scene<State>) {
    return s;
}

export function layer<State>(render: Render<State>): Layer<State> {
    return { render };
}

export function staticLayer<State>(render: Render<State>): Layer<State> {
    return {
        prepare: render,
    };
}

export function statelessLayer(render: (canvas: Canvas) => void): Layer<unknown> {
    return {
        prepare({ canvas }) {
            render(canvas);
        },
    };
}

export function colorLayer(color: Color): Layer<unknown> {
    return {
        prepare({ canvas: { context, width, height } }) {
            context.save();
            context.scale(width, height);
            context.fillStyle = resolveColor(color, context);
            context.fillRect(0, 0, 1, 1);
            context.restore();
        }
    };
}

export function dynamicColorLayer<State>(
    colorF: (state: State, frame: number) => Color,
): Layer<State> {
    return {
        render({ canvas: { context, width, height }, state, frame }) {
            context.save();
            context.scale(width, height);
            context.fillStyle = resolveColor(
                colorF(state, frame), context,
            );
            context.fillRect(0, 0, 1, 1);
            context.restore();
        }
    };
}

export function gradientLayer(stops: ColorStop[]) {
    return colorLayer({
        kind: 'gradient',
        start: [0, 0],
        end: [0, 1],
        stops,
    });
}

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

export function combineScenes(...scenes: Scene<any>[]): Scene<unknown[]> {
    return {
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
}