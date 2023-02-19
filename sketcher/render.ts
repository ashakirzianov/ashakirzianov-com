import { Box, boxRange } from "./box";
import { Color, ColorStop, fromRGBA, multRGBA, resolveColor, resolvePrimitiveColor, RGBAColor, unifromStops } from "./color";
import { NumRange, rangeLength } from "./range";
import { addVector, multsVector, Vector } from "./vector";

export type Canvas2DContext = CanvasRenderingContext2D;
export type Canvas = {
    context: Canvas2DContext,
    width: number,
    height: number,
};
export type RenderProps<State> = {
    canvas: Canvas,
    state: State,
};
export type Render<State> = (props: RenderProps<State>) => void;

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
    context.fillStyle = resolveColor(fill, context);
    context.strokeStyle = resolveColor(stroke, context);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
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
    context.strokeStyle = resolveColor(color, context);
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
    context.strokeStyle = resolveColor(left, context);
    context.stroke();
    context.beginPath();
    context.moveTo(x, height);
    context.lineTo(width, height);
    context.strokeStyle = resolveColor(bottom, context);
    context.stroke();
    context.beginPath();
    context.moveTo(width, height);
    context.lineTo(width, y);
    context.strokeStyle = resolveColor(right, context);
    context.stroke();
    context.beginPath();
    context.moveTo(width, y);
    context.lineTo(x, y);
    context.strokeStyle = resolveColor(top, context);
    context.stroke();
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
            ({ offset, color }) => gradient.addColorStop(offset, resolvePrimitiveColor(color)),
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

export function clearFrame({ color, canvas }: {
    color: Color,
    canvas: Canvas,
}) {
    canvas.context.fillStyle = resolveColor(color, canvas.context);
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
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

export function centerOnPoint({ canvas, point }: {
    point: Vector,
    canvas: Canvas,
}) {
    let [shiftx, shifty] = point;
    canvas.context.translate(-shiftx, -shifty);
}