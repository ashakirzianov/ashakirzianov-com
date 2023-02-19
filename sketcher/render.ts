import { Box } from "./box";
import { Color } from "./color";
import { Canvas, clearFrame, zoomToFill, zoomToFit } from "./draw";
import { WithPosition } from "./object";
import { addVector, multsVector, Vector, zeroVector } from "./vector";

export type RenderProps<State> = {
    canvas: Canvas,
    state: State,
};
export type Render<State> = (props: RenderProps<State>) => void;
export type RenderTransform<State> = (render: Render<State>) => Render<State>;
export type WithSets<T> = { sets: T[] };

export function objectSetsRender<ObjectT>(drawObject: (props: { canvas: Canvas, object: ObjectT }) => void,
): Render<WithSets<ObjectT[]>> {
    return function render({ canvas, state }) {
        for (let set of state.sets) {
            for (let object of set) {
                drawObject({ canvas, object });
            }
        }
    };
}

export function transform<State>(
    draw: (canvas: Canvas, state: State) => void,
): RenderTransform<State> {
    return function (render) {
        return function ({ canvas, state }) {
            canvas.context.save();
            draw(canvas, state);
            render({ canvas, state });
            canvas.context.restore();
        }
    }
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