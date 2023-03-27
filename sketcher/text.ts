import { boundingBox, boxSize } from "./box";
import { Color, resolveColor } from "./color";
import {
    Dimensions, Justification, layoutElement, LayoutElement, LayoutPadding, Position,
    PositionedElement, PositionedLayout,
} from "./layout";
import { removeUndefined } from "./misc";
import { Canvas, Canvas2DContext } from "./render";

export type TextFont = {
    font?: string,
    fontSize?: number | string,
    fontUnits?: string,
    fontFamily?: string,
    bold?: boolean,
    italic?: boolean,
    smallCaps?: boolean,
};
export type TextStyle = TextFont & {
    color?: Color,
    useFontBoundingBox?: boolean,
    compositeOperation?: GlobalCompositeOperation,
    letterBox?: {
        padding?: number,
        borderColor?: Color,
        borderWidth?: number,
    },
};
export type TextLayoutProps = TextStyle & {
    text?: string,
    hidden?: boolean,
    border?: Color,
    rotation?: number,
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
        view: dimensions,
        resolveDimensions(element) {
            if (element.text === undefined) {
                return undefined;
            }
            context.save();
            context.textBaseline = 'alphabetic';
            context.textAlign = 'center';
            applyTextStyle(context, element);
            applyElementTransform(context, element);
            let dims: Dimensions | undefined = undefined;
            let measures = context.measureText(element.text);
            if (element.letterBox) {
                let side = (measures.fontBoundingBoxAscent + measures.fontBoundingBoxDescent) * (1 + (element.letterBox.padding ?? 0));
                dims = transformDimensions({
                    width: side * element.text.length,
                    height: side,
                }, context);
            } else {
                dims = element.useFontBoundingBox ?? false
                    ? transformDimensions({
                        width: measures.width,
                        height: measures.fontBoundingBoxAscent + measures.fontBoundingBoxDescent,
                    }, context)
                    : transformDimensions({
                        width: (measures.actualBoundingBoxRight + measures.actualBoundingBoxLeft),
                        height: measures.actualBoundingBoxDescent + measures.actualBoundingBoxAscent,
                    }, context);
            }
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
        [a, b, c, d].map(p => ({
            x: p.x, y: p.y, z: 0,
        }))
    );
    return boxSize(box);
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
    context.save();
    applyTextStyle(context, element);
    if (element.text) {
        context.save();
        context.textAlign = 'center';
        context.translate(position.left, position.top);
        if (element.letterBox) {
            context.textBaseline = 'middle';
            let measures = context.measureText(element.text);
            let side = (measures.fontBoundingBoxAscent + measures.fontBoundingBoxDescent) * (1 + (element.letterBox.padding ?? 0));
            context.translate(-side / 2, side / 2);
            applyElementTransform(context, element);
            for (let idx = 0; idx < element.text.length; idx++) {
                let char = element.text[idx]!;
                context.translate(side, 0);
                context.fillText(char, 0, 0);
                if (element.letterBox.borderColor) {
                    context.strokeStyle = resolveColor(element.letterBox.borderColor, context);
                    if (element.letterBox.borderWidth) {
                        context.lineWidth = element.letterBox.borderWidth;
                    }
                    context.strokeRect(-side / 2, -side / 2, side, side);
                }
            }
        } else {
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
        }
        context.restore();
    }
    if (element.border) {
        context.strokeStyle = resolveColor(element.border, context);
        context.strokeRect(position.left, position.top, dimensions.width, dimensions.height);
    }
    context.restore();
}

export function applyTextStyle(context: Canvas2DContext, style: TextStyle) {
    let font = resolveFont(style);
    context.font = font;
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

function resolveFont({
    font,
    fontFamily, fontSize, fontUnits,
    bold, italic, smallCaps,
}: TextFont): string {
    if (font) {
        return font;
    }
    let prefix = removeUndefined([
        bold ? 'bold' : undefined,
        italic ? 'italic' : undefined,
        smallCaps ? 'small-caps' : undefined,
    ]).join(' ');
    let units = fontUnits ?? 'vh';
    let size = typeof fontSize === 'number'
        ? `${fontSize}${units}`
        : (fontSize ?? '12pt');
    let family = fontFamily ?? 'sans-serif';
    return `${prefix} ${size} ${family}`;
}