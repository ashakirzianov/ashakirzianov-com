import { Canvas, Layer } from "./base";
import { ColorStop, fillGradient } from "./draw";

export function gradientLayer(stops: ColorStop[]): Layer<any> {
    return {
        render({ canvas }) {
            fillGradient({ canvas, stops });
        },
        static: true,
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