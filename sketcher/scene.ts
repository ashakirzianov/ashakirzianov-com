import { Animator } from "./animator";
import { ColorStop } from "./color";
import { Canvas, fillGradient } from "./draw";
import { Render, RenderTransform } from "./render";
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

export function gradientLayer(stops: ColorStop[]): Layer<any> {
    return {
        render({ canvas }) {
            fillGradient({ canvas, stops });
        },
        static: true,
    };
}