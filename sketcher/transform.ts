import { Canvas2d, Render, WithSets } from "./render"
import { WithPosition } from "./object"
import { Vector } from "./vector"

export type RenderTransform<State> = (render: Render<State>) => Render<State>;
export function transform<State>(
    draw: (canvas: Canvas2d, state: State) => void,
): RenderTransform<State> {
    return function (render) {
        return function ({ canvas, frame, state }) {
            canvas.context.save()
            draw(canvas, state)
            render({ canvas, frame, state })
            canvas.context.restore()
        }
    }
}

export function centerOnObjectTransform<State extends WithSets<WithPosition>>({ index }: {
    index: number,
}): RenderTransform<State> {
    return function transform(render) {
        return function ({ canvas, frame, state }) {
            if (index < state.sets.length) {
                canvas.context.save()
                let { x, y } = state.sets[index]!.position
                canvas.context.translate(-x, -y)
                render({ canvas, frame, state })
                canvas.context.restore()
            }
        }
    }
}

export function centerOnPointTransform<State>({ point: { x, y } }: {
    point: Vector,
}): RenderTransform<State> {
    return function transform(render) {
        return function ({ canvas, frame, state }) {
            canvas.context.save()
            canvas.context.translate(-x, -y)
            render({ canvas, frame, state })
            canvas.context.restore()
        }
    }
}

export function combineTransforms<State>(...transforms: RenderTransform<State>[]): RenderTransform<State> {
    return function transform(render) {
        return transforms.reduceRight(
            (res, curr) => curr(res),
            render,
        )
    }
}

export const emptyRender: Render<unknown> = () => { }

export function renderFromTransforms<State>(...transforms: RenderTransform<State>[]): Render<State> {
    return combineTransforms(...transforms)(emptyRender)
}