import { boundingBox } from "./box";
import { Color, resolveColor } from "./color";
import {
    Dimensions, Justification, layoutElement, LayoutElement, LayoutPadding, Position,
    PositionedElement, PositionedLayout,
} from "./layout";
import { Canvas, Canvas2DContext } from "./render";

export type TextFont = string;
export type TextStyle = {
    font?: TextFont,
    color?: Color,
    rotation?: number,
    useFontBoundingBox?: boolean,
    compositeOperation?: GlobalCompositeOperation,
};
export type TextLayoutProps = TextStyle & {
    text?: string,
    hidden?: boolean,
    border?: Color,
}
export type TextLayout = LayoutElement<TextLayoutProps>;
export type PositionedTextLayout = PositionedLayout<TextLayoutProps>;

export function layoutOnCanvas(canvas: Canvas, root: TextLayout) {
    return layoutText({
        context: canvas.context,
        position: { top: 0, left: 0 },
        dimensions: { width: canvas.width, height: canvas.height },
        root,
    });
}

export function layoutText({
    context, position, dimensions, root,
}: {
    context: Canvas2DContext,
    position: Position,
    dimensions: Dimensions,
    root: TextLayout,
}) {
    return layoutElement(root, {
        position,
        dimensions,
        resolveDimensions(element) {
            if (element.text === undefined) {
                return undefined;
            }
            context.save();
            context.textBaseline = 'alphabetic';
            context.textAlign = 'center';
            applyTextStyle(context, element);
            applyElementTransform(context, element);
            let mesures = context.measureText(element.text);
            let dims = element.useFontBoundingBox ?? false
                ? transformDimensions({
                    width: mesures.width,
                    height: mesures.fontBoundingBoxAscent + mesures.fontBoundingBoxDescent,
                }, context)
                : transformDimensions({
                    width: (mesures.actualBoundingBoxRight + mesures.actualBoundingBoxLeft),
                    height: mesures.actualBoundingBoxDescent + mesures.actualBoundingBoxAscent,
                }, context);
            context.restore();
            return dims;
        },
    });
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
    let layout = layoutOnCanvas(canvas, root);
    renderPositionedLayout({ layout, context: canvas.context });
    canvas.context.restore();
}

export function renderPositionedLayout({ context, layout }: {
    context: Canvas2DContext,
    layout: PositionedTextLayout,
}) {
    context.save();
    layout.forEach(positioned => renderPositionedElement({
        positioned, context,
    }));
    context.restore();
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
    if (style.compositeOperation) {
        context.globalCompositeOperation = style.compositeOperation;
    }
}

export function applyElementTransform(context: Canvas2DContext, element: TextLayout) {
    if (element.rotation) {
        context.rotate(element.rotation);
    }
}

type SideProps = string | TextLayout | SideProps[];
export function sidesTextLayout({
    canvas, texts, padding, inside, style,
}: {
    canvas: Canvas,
    texts: {
        left?: SideProps,
        top?: SideProps,
        right?: SideProps,
        bottom?: SideProps,
    },
    style?: TextStyle,
    padding?: LayoutPadding,
    inside?: TextLayout,
}) {
    function textProps(text: SideProps | undefined, pos: 'left' | 'right' | 'top' | 'bottom'): TextLayout {
        let rotation = pos === 'left' ? -Math.PI / 2
            : pos === 'right' ? Math.PI / 2
                : pos === 'top' ? undefined
                    : Math.PI;
        if (text === undefined) {
            return {
                text: '',
                ...style,
                hidden: true,
                rotation,
            };
        } else if (typeof text === 'string') {
            return {
                ...style,
                text,
                rotation
            };
        } else if (Array.isArray(text)) {
            let content = text.map(t => textProps(t, pos));
            if (pos === 'bottom' || pos === 'left') {
                content.reverse();
            }
            return {
                direction: pos === 'top' || pos === 'bottom'
                    ? 'row' : 'column',
                content,
            };
        } else {
            return {
                ...style,
                ...text,
                rotation,
            };
        }
    }
    function inverseJustification(justify: Justification) {
        return justify === 'start' ? 'end'
            : justify === 'end' ? 'start'
                : justify;
    }
    let left = textProps(texts.left, 'left');
    let top = textProps(texts.top, 'top');
    let right = textProps(texts.right, 'right');
    let bottom = textProps(texts.bottom, 'bottom');
    let horizontal = layoutOnCanvas(canvas, {
        padding,
        direction: 'column',
        justify: 'space-between',
        content: [{
            id: '--top-container',
            justify: top.justify ?? 'start',
            content: [top],
        }, {
            id: '--bottom-container',
            justify: inverseJustification(bottom.justify ?? 'start'),
            content: [bottom],
        }],
    });

    let vertical = layoutOnCanvas(canvas, {
        padding,
        direction: 'row',
        justify: 'space-between',
        content: [{
            id: '--left-container',
            direction: 'column',
            justify: inverseJustification(left.justify ?? 'start'),
            content: [left],
        }, {
            id: '--right-container',
            direction: 'column',
            justify: right.justify ?? 'start',
            content: [right],
        }],
    });

    let topElement = horizontal.find(p => p.element.id === '--top-container')!; let bottomElement = horizontal.find(p => p.element.id === '--bottom-container')!;
    let leftElement = vertical.find(p => p.element.id === '--left-container')!;
    let rightElement = vertical.find(p => p.element.id === '--right-container')!;



    let position = {
        top: topElement.position.top + topElement.dimensions.height,
        left: leftElement.position.left + leftElement.dimensions.width,
    };
    let dimensions = {
        width: rightElement.position.left - position.left,
        height: bottomElement.position.top - position.top,
    };
    let insideLayout = inside ? layoutText({
        context: canvas.context,
        position,
        dimensions,
        root: inside,
    }) : [];

    return [...horizontal, ...vertical, ...insideLayout];
}