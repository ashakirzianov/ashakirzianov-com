import { Layer } from "./base";
import { ColorStop, fillGradient } from "./draw";

export function gradientLayer(stops: ColorStop[]): Layer<any> {
    return {
        render({ canvas }) {
            fillGradient({ canvas, stops });
        },
        static: true,
    };
}