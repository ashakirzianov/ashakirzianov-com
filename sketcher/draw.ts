import { Color, Dimensions, Vector } from "./base";
import { rangeLength } from "./utils";

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

export function strokeDimensions({
    context, color, dimensions,
}: {
    color: Color,
    dimensions: Dimensions,
    context: CanvasRenderingContext2D,
}) {
    context.save();
    context.strokeStyle = color;
    context.strokeRect(
        dimensions.x.min, dimensions.y.min,
        rangeLength(dimensions.x), rangeLength(dimensions.y),
    );
    context.restore();
}

export function colorRect({
    context, width, height, start: [x, y],
    colors: [top, bottom, left, right],
}: {
    context: CanvasRenderingContext2D,
    start: Vector,
    width: number,
    height: number,
    colors: [Color, Color, Color, Color],
}) {
    context.save();
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, height);
    context.strokeStyle = left;
    context.stroke();
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(width, height);
    context.strokeStyle = bottom;
    context.stroke();
    context.beginPath();
    context.moveTo(width, height);
    context.lineTo(width, y);
    context.strokeStyle = right;
    context.stroke();
    context.beginPath();
    context.moveTo(width, y);
    context.lineTo(x, y);
    context.strokeStyle = top;
    context.stroke();
    context.restore();
}