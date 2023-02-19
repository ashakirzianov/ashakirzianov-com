import { Animator } from "./animator";
import { Color, ColorStop, resolveColor } from "./color";
import { Canvas, Render } from "./render";
import { RenderTransform } from "./transform";
export type Layer<State> = {
    render: Render<State>,
    transforms?: RenderTransform<State>[],
    static?: boolean,
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
        static: true, render,
    };
}

export function statelessLayer(render: (canvas: Canvas) => void): Layer<any> {
    return {
        static: true,
        render({ canvas }) {
            render(canvas);
        },
    };
}

export function colorLayer(color: Color): Layer<any> {
    return {
        static: true,
        render({ canvas: { context, width, height } }) {
            context.save();
            context.fillStyle = resolveColor(color, context);
            context.fillRect(0, 0, width, height);
            context.restore();
        }
    };
}

export function gradientLayer(stops: ColorStop[]): Layer<any> {
    return {
        static: true,
        render({ canvas: { context, width, height } }) {
            context.save();
            let color = resolveColor({
                kind: 'gradient',
                start: [0, 0],
                end: [0, height],
                stops,
            }, context);
            context.fillStyle = color;
            context.fillRect(0, 0, width, height);
            context.restore();
        }
    };
}