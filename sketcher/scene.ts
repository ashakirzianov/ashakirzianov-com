import { Animator } from "./animator";
import { Color, ColorStop, resolveColor } from "./color";
import { Canvas, Render } from "./render";
export type Layer<State> = {
    render?: Render<State>,
    prepare?: Render<State>,
    hidden?: boolean,
}
export type Scene<State> = {
    state: State,
    animator: Animator<State>,
    layers: Layer<State>[],
};

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
    colorF: (state: State) => Color,
): Layer<State> {
    return {
        render({ canvas: { context, width, height }, state }) {
            context.save();
            context.scale(width, height);
            context.fillStyle = resolveColor(
                colorF(state), context,
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