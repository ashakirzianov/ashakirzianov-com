import {
    Color, NumRange, Render, Vector, RenderTransform,
    WithSets, WithPosition, Canvas, Box,
} from "./base";
import { boxRange } from "./box";
import { resolveColor } from "./color";
import { rangeLength } from "./utils";
import vector from "./vector";

export function clearFrameTransform<State>({ color }: {
    color: Color,
}): RenderTransform<State> {
    return function (render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            clearFrame({ color, canvas });
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function clearFrame({ color, canvas }: {
    color: Color,
    canvas: Canvas,
}) {
    canvas.context.fillStyle = resolveColor(color);
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
}

export function zoomToFitTransform<State>(box: Box): RenderTransform<State> {
    return function zoomToFitTransform(render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            zoomToFit({ canvas, box });
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function zoomToFit({ canvas, box }: {
    canvas: Canvas,
    box: Box,
}) {
    let { widthRange, heightRange } = boxRange(box);
    let uwidth = rangeLength(widthRange);
    let uheight = rangeLength(heightRange);
    let xratio = canvas.width / uwidth;
    let yratio = canvas.height / uheight;
    let ratio = Math.min(xratio, yratio);
    let shiftx = (canvas.width - uwidth * ratio) / 2;
    let shifty = (canvas.height - uheight * ratio) / 2;
    canvas.context.translate(
        shiftx, shifty,
    );
    canvas.context.scale(ratio, ratio);
    canvas.context.translate(
        - widthRange.min,
        - heightRange.min,
    );
}

export function zoomToFillTransform<State>(box: Box): RenderTransform<State> {
    return function zoomToFitTransform(render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            zoomToFill({ box, canvas });
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function zoomToFill({ canvas, box }: {
    canvas: Canvas,
    box: Box,
}) {
    let { widthRange, heightRange } = boxRange(box);
    let uwidth = rangeLength(widthRange);
    let uheight = rangeLength(heightRange);
    let xratio = canvas.width / uwidth;
    let yratio = canvas.height / uheight;
    let ratio = Math.max(xratio, yratio);
    let shiftx = (canvas.width - uwidth * ratio) / 2;
    let shifty = (canvas.height - uheight * ratio) / 2;
    canvas.context.translate(
        shiftx, shifty,
    );
    canvas.context.scale(ratio, ratio);
    canvas.context.translate(
        - widthRange.min,
        - heightRange.min,
    );
}

export function centerOnObjectTransform<State extends WithSets<WithPosition>>({ index }: {
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

export function centerOnPointTransform<State>({ point: [shiftx, shifty] }: {
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

export function centerOnMidpointTransform<State>(
    getObjects: (state: State) => WithPosition[],
): RenderTransform<State> {
    return function transform(render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            centerOnMidpoint({ canvas, objects: getObjects(state) });
            render({ canvas, state });
            canvas.context.restore();
        }
    }
}

export function centerOnMidpoint({ canvas, objects }: {
    canvas: Canvas,
    objects: WithPosition[],
}) {
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
    let [shiftx, shifty] = calcMidpoint(objects);
    canvas.context.translate(-shiftx, -shifty);
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