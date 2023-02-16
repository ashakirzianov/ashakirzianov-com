import { Color } from "./base"
import { RenderTransform } from "./render";

export type ColorStop = { offset: number, color: Color };
export function createLinearGradient({
    context, colorStops, start, end,
}: {
    context: CanvasRenderingContext2D,
    colorStops: ColorStop[],
    start: [number, number],
    end: [number, number],
}) {
    let gradient = context.createLinearGradient(start[0], start[1], end[0], end[1]);
    colorStops.forEach(({ offset, color }) => gradient.addColorStop(offset, color));
    return gradient;
}