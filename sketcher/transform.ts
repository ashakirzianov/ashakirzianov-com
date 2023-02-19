import {
    Color, NumRange, Render, Vector, WithSets, WithPosition,
} from "./base";
import { rangeLength } from "./utils";
import vector from "./vector";

export type RenderTransform<State> = (render: Render<State>) => Render<State>;

export function clearFrame<State>({ color }: {
    color: Color,
}): RenderTransform<State> {
    return function (render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            canvas.context.fillStyle = color;
            canvas.context.fillRect(0, 0, canvas.width, canvas.height);
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function zoomToFit<State>({ widthRange, heightRange }: {
    widthRange: NumRange,
    heightRange: NumRange,
}): RenderTransform<State> {
    return function zoomToFitTransform(render) {
        return function ({ canvas, state }) {
            let uwidth = rangeLength(widthRange);
            let uheight = rangeLength(heightRange);
            let xratio = canvas.width / uwidth;
            let yratio = canvas.height / uheight;
            let ratio = Math.min(xratio, yratio);
            let shiftx = (canvas.width - uwidth * ratio) / 2;
            let shifty = (canvas.height - uheight * ratio) / 2;
            canvas.context.save();
            canvas.context.translate(
                shiftx, shifty,
            );
            canvas.context.scale(ratio, ratio);
            canvas.context.translate(
                - widthRange.min,
                - heightRange.min,
            );
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function zoomToFill<State>({ widthRange, heightRange }: {
    widthRange: NumRange,
    heightRange: NumRange,
}): RenderTransform<State> {
    return function zoomToFitTransform(render) {
        return function ({ canvas, state }) {
            let uwidth = rangeLength(widthRange);
            let uheight = rangeLength(heightRange);
            let xratio = canvas.width / uwidth;
            let yratio = canvas.height / uheight;
            let ratio = Math.max(xratio, yratio);
            let shiftx = (canvas.width - uwidth * ratio) / 2;
            let shifty = (canvas.height - uheight * ratio) / 2;
            canvas.context.save();
            canvas.context.translate(
                shiftx, shifty,
            );
            canvas.context.scale(ratio, ratio);
            canvas.context.translate(
                - widthRange.min,
                - heightRange.min,
            );
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function centerOnObject<State extends WithSets<WithPosition>>({ index }: {
    index: number,
}): RenderTransform<State> {
    return function transform(render) {
        return function ({ canvas, state }) {
            if (index < state.sets.length) {
                canvas.context.save();
                let [shiftx, shifty] = state.sets[index]!.position;
                canvas.context.translate(-shiftx, -shifty);
                render({ canvas, state });
                canvas.context.restore();
            }
        }
    }
}

export function centerOnPoint<State>({ point: [shiftx, shifty] }: {
    point: Vector,
}): RenderTransform<State> {
    return function transform(render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            canvas.context.translate(-shiftx, -shifty);
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function centerOnMidpoint<State>(
    getObjects: (state: State) => WithPosition[],
): RenderTransform<State> {
    function calcMidpoint(objects: WithPosition[]) {
        let { position, mass } = objects.reduce(
            (res, curr) => ({
                position: vector.add(res.position, curr.position),
                mass: 1 + (res as any).mass,
            }),
            { position: vector.zero(3), mass: 1 },
        );
        return vector.mults(position, 1 / mass);
    }
    return function transform(render) {
        return function ({ canvas, state }) {
            let [shiftx, shifty] = calcMidpoint(getObjects(state));
            canvas.context.save();
            canvas.context.translate(-shiftx, -shifty);
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function combineTransforms<State>(...transforms: RenderTransform<State>[]): RenderTransform<State> {
    return function transform(render) {
        return transforms.reduceRight(
            (res, curr) => curr(res),
            render,
        );
    }
}

export const emptyRender: Render<unknown> = () => { };

export function renderFromTransforms<State>(...transforms: RenderTransform<State>[]): Render<State> {
    return combineTransforms(...transforms)(emptyRender);
}