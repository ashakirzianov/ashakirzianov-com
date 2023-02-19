import {
    Canvas, Canvas2DContext, Color, NumRange, Render, RGBAColor, Vector, WithSets,
} from "./base";
import { fromRGBA, multRGBA, unifromStops } from "./color";
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
    context: Canvas2DContext,
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
    context: Canvas2DContext,
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
    dimensions: {
        x: NumRange,
        y: NumRange,
    },
    context: Canvas2DContext,
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
    context: Canvas2DContext,
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

export function fillGradient({
    canvas: { context, width, height },
    stops,
}: {
    canvas: Canvas,
    stops: ColorStop[],
}) {
    context.save();
    var gradient = context.createLinearGradient(0, 0, 0, height);
    stops.forEach(
        ({ offset, color }) => gradient.addColorStop(offset, color),
    );

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.restore();
}

export function drawCorner({
    canvas, offset, angle, border, color,
}: {
    canvas: Canvas,
    offset: number,
    angle: number,
    border?: number,
    color: RGBAColor,
}) {
    let { context, width, height } = canvas;
    context.save();

    function wall({
        stops, border,
    }: {
        stops: ColorStop[],
        border?: number,
    }) {
        context.save();
        var gradient = context.createLinearGradient(0, 0, 0, height);
        stops.forEach(
            ({ offset, color }) => gradient.addColorStop(offset, color),
        );

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        if (border) {
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.beginPath();
            context.moveTo(0, height);
            context.lineTo(width, height);
            context.lineTo(width, 0);
            context.stroke();
        }
        context.restore();
    }

    let base = fromRGBA(color);
    let lightest = fromRGBA(multRGBA(color, 1.2));
    let light = fromRGBA(multRGBA(color, 1.05));
    let dark = fromRGBA(multRGBA(color, 0.95));
    context.fillStyle = lightest;
    context.fillRect(0, 0, width, height);
    let skew = Math.cos(-Math.PI * angle);
    context.save();
    context.translate(-offset * width, 0);
    context.transform(1, skew, 0, 1, 0, 0);
    wall({
        stops: unifromStops([base, light]),
        border,
    });
    context.restore();
    context.save();
    context.scale(-1, 1);
    context.translate(-width, 0);
    context.translate(-(1 - offset) * width, 0);
    context.transform(1, skew, 0, 1, 0, 0);
    wall({
        stops: unifromStops([dark, base]),
        border,
    });
    context.restore();

    context.restore();
}

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