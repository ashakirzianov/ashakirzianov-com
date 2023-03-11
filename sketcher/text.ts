import { boundingBox } from "./box";
import { Color, resolveColor } from "./color";
import {
    Dimensions, layoutElement, LayoutElement, PositionedElement,
} from "./layout";
import { Canvas, Canvas2DContext } from "./render";

export type TextFont = string;
export type TextStyle = {
    font?: TextFont,
    color?: Color,
    rotation?: number,
    useFontBoundingBox?: boolean,
};
export type TextLayoutProps = TextStyle & {
    text?: string,
    hidden?: boolean,
    border?: Color,
}
export type TextLayout = LayoutElement<TextLayoutProps>;

export function layoutText(canvas: Canvas, root: TextLayout) {
    return layoutElement(root, {
        position: { top: 0, left: 0 },
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
            canvas.context.textAlign = 'center';
            applyTextStyle(canvas.context, element);
            applyElementTransform(canvas.context, element);
            let mesures = canvas.context.measureText(element.text);
            let dims = element.useFontBoundingBox ?? false
                ? transformDimensions({
                    width: mesures.width,
                    height: mesures.fontBoundingBoxAscent + mesures.fontBoundingBoxDescent,
                }, canvas.context)
                : transformDimensions({
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
    let layout = layoutText(canvas, root);
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
    if (element.hidden) {
        return;
    }
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
            if (element.useFontBoundingBox) {
                context.translate(mesures.actualBoundingBoxLeft, mesures.fontBoundingBoxAscent);
            } else {
                context.translate(mesures.actualBoundingBoxLeft, mesures.actualBoundingBoxAscent);
            }
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