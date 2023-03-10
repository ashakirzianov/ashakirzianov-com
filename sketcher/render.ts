import { boundingBox, Box, boxRange } from "./box";
import {
    Color, ColorStop, fromRGBA, multRGBA, resolveColor, resolvePrimitiveColor, RGBAColor, unifromStops,
} from "./color";
import {
    Dimensions, layoutElement, LayoutElement, PositionedElement,
} from "./layout";
import { NumRange, rangeLength } from "./range";
import { Vector } from "./vector";

export type Canvas2DContext = CanvasRenderingContext2D;
export type Canvas = {
    context: Canvas2DContext,
    width: number,
    height: number,
};
export type RenderProps<State> = {
    canvas: Canvas,
    frame: number,
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
    lineWidth?: number,
    fill?: Color,
    stroke?: Color,
    position: Vector,
    radius: number,
    context: Canvas2DContext,
}) {
    context.save();
    if (lineWidth) {
        context.lineWidth = lineWidth;
    }
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
        context.fillStyle = resolveColor(fill, context);
        context.fill();
    }
    if (stroke) {
        context.strokeStyle = resolveColor(stroke, context);
        context.stroke();
    }
    context.restore();
}

export function concentringCircles({
    context, position, radius, fills,
}: {
    context: Canvas2DContext,
    position: Vector,
    radius: number,
    fills: Color[],
}) {
    let n = fills.length;
    for (let i = 0; i < n; i++) {
        let fill = fills[i]!;
        circle({
            context, fill, position,
            radius: radius * (n - i + 1) / n,
        });
    }
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

export function clearCanvas(canvas: Canvas) {
    canvas.context.save();
    canvas.context.resetTransform();
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.context.restore();
}

export function clearFrame({ color, canvas: { context, width, height } }: {
    color: Color,
    canvas: Canvas,
}) {
    context.save();
    context.resetTransform();
    context.scale(width, height);
    context.fillStyle = resolveColor(color, context);
    context.fillRect(0, 0, 1, 1);
    context.restore();
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

export type TextFont = string;
export type TextStyle = {
    font?: TextFont,
    color?: Color,
    rotation?: number,
};
export type TextLayoutProps = TextStyle & {
    text?: string,
    border?: Color,
}
export type TextLayout = LayoutElement<TextLayoutProps>;

export function layoutText({ canvas, root }: {
    canvas: Canvas,
    root: TextLayout,
}) {
    return layoutElement(root, {
        dimensions: {
            width: canvas.width,
            height: canvas.height,
        },
        resolveDimensions(element) {
            if (element.text === undefined) {
                return undefined;
            }
            canvas.context.save();
            canvas.context.textBaseline = 'alphabetic';
            canvas.context.textAlign = 'left';
            applyTextStyle(canvas.context, element);
            applyElementTransform(canvas.context, element);
            let mesures = canvas.context.measureText(element.text);
            let dims = transformDimensions({
                width: (mesures.actualBoundingBoxRight + mesures.actualBoundingBoxLeft),
                height: mesures.actualBoundingBoxDescent + mesures.actualBoundingBoxAscent,
            }, canvas.context);
            canvas.context.restore();
            return dims;
        },
    })
}

function transformDimensions(dimensions: Dimensions, context: Canvas2DContext): Dimensions {
    let transform = context.getTransform();
    let w = dimensions.width / 2;
    let h = dimensions.height / 2;
    let a = transform.transformPoint(new DOMPoint(-w, -h));
    let b = transform.transformPoint(new DOMPoint(w, -h));
    let c = transform.transformPoint(new DOMPoint(w, h));
    let d = transform.transformPoint(new DOMPoint(-w, h));
    let box = boundingBox(
        [a, b, c, d].map(p => ([p.x, p.y, 0]))
    );
    return {
        width: box.end[0] - box.start[0],
        height: box.end[1] - box.start[1],
    };
}

export function layoutAndRender({ canvas, root, style }: {
    canvas: Canvas,
    root: TextLayout,
    style?: TextStyle,
}) {
    canvas.context.save();
    if (style) {
        applyTextStyle(canvas.context, style);
    }
    let layout = layoutText({ canvas, root });
    for (let positioned of layout) {
        renderPositionedElement({
            positioned, context: canvas.context,
        });
    }
    canvas.context.restore();
}

export function renderPositionedElement({
    context, positioned: { element, position, dimensions },
}: {
    context: Canvas2DContext,
    positioned: PositionedElement<TextLayoutProps>,
}) {
    if (element.text) {
        context.save();
        context.textAlign = 'center';
        applyTextStyle(context, element);
        context.translate(position.left, position.top);
        if (element.rotation) {
            context.textBaseline = 'middle';
            context.translate(dimensions.width / 2, dimensions.height / 2);
        } else { // 'alphabetic' baseline is more precise (but doesn't work with rotation)
            context.textBaseline = 'alphabetic';
            context.textAlign = 'start';
            let mesures = context.measureText(element.text);
            context.translate(mesures.actualBoundingBoxLeft, mesures.actualBoundingBoxAscent);
        }
        applyElementTransform(context, element);
        context.fillText(element.text, 0, 0);
        context.restore();
    }
    if (element.border) {
        context.save();
        context.strokeStyle = resolveColor(element.border, context);
        context.strokeRect(position.left, position.top, dimensions.width, dimensions.height);
        context.restore();
    }
}

export function applyTextStyle(context: Canvas2DContext, style: TextStyle) {
    if (style.font) {
        context.font = style.font;
    }
    if (style.color) {
        context.fillStyle = resolveColor(style.color, context);
    }
}

export function applyElementTransform(context: Canvas2DContext, element: TextLayout) {
    if (element.rotation) {
        context.rotate(element.rotation);
    }
}

export function renderMask(
    context: Canvas2DContext,
    render: (context: Canvas2DContext) => void,
) {
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = 'black';
    render(context);
    context.restore();
}