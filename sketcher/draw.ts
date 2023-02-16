import { Color, Vector } from "./base";

export function circle({
    lineWidth, fill, stroke,
    position: [x, y], radius,
    context,
}: {
    lineWidth: number,
    fill: Color,
    stroke: Color,
    position: Vector,
    radius: number,
    context: CanvasRenderingContext2D,
}) {
    context.save();
    context.lineWidth = lineWidth;
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
}

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