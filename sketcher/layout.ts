export type Dimensions = {
    width: number,
    height: number,
};
export type Position = {
    top: number,
    left: number,
};
export type LayoutElement = LayoutFlex | LayoutText;
export type Justification = 'start' | 'center' | 'end';
export type LayoutDirection = 'row' | 'column';
export type LayoutFlex = {
    kind?: 'flex',
    id?: string,
    content?: LayoutElement[],
    grow?: number,
    direction?: LayoutDirection,
    justify?: Justification,
    crossJustify?: Justification,
};
export type LayoutText = {
    kind: 'text',
    id?: string,
    text: string,
};
export type PositionedElement = Position & Dimensions & {
    element: LayoutElement,
};
export type Layout = PositionedElement[];
export type LayoutContext = {
    dimensions: Dimensions,
    getTextDimensions: (text: LayoutText) => Dimensions,
};

export function layoutElement(element: LayoutElement, context: LayoutContext): Layout {
    if (element.kind === 'text') {
        return [{
            element,
            top: 0, left: 0,
            ...context.getTextDimensions(element),
        }];
    } else {
        return layoutFlex(element, context);
    }
}

function layoutFlex(
    flex: LayoutFlex,
    { dimensions, getTextDimensions }: LayoutContext,
): Layout {
    let result: Layout = [];

    // Add self
    result.push({
        element: flex,
        top: 0,
        left: 0,
        width: dimensions.width,
        height: dimensions.height,
    });

    // Set defaults
    let content = flex.content ?? [];
    let direction = flex.direction ?? 'row';
    let justify = flex.justify ?? 'center';

    // Calculate growth
    let flexLength = direction === 'row'
        ? dimensions.width : dimensions.height;
    let dims = content.map(el => getDimensions(el, getTextDimensions));
    let contentLength = direction === 'row'
        ? dims.reduce((r, d) => r + d.width, 0)
        : dims.reduce((r, d) => r + d.height, 0);
    let totalGrow = content.reduce((r, e) => r + getGrow(e), 0);
    let extraLength = Math.max(0, flexLength - contentLength);
    let growUnit = totalGrow === 0 ? 0 : extraLength / totalGrow;

    // Grow content dimensions
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let growLength = getGrow(child) * growUnit;
        // TODO: respect cross-justification
        if (direction === 'row') {
            dims[idx]!.width += growLength;
            dims[idx]!.height = dimensions.height;
        } else {
            dims[idx]!.width = dimensions.width;
            dims[idx]!.height += growLength;
        }
    }

    let adjustedLength = direction === 'row'
        ? dims.reduce((r, d) => r + d.width, 0)
        : dims.reduce((r, d) => r + d.height, 0);
    let offsetLen = justify === 'start' ? 0
        : justify === 'end' ? flexLength - adjustedLength
            : (flexLength - adjustedLength) / 2; // 'center'
    let offset: Position = direction === 'row'
        ? { top: 0, left: offsetLen }
        : { top: offsetLen, left: 0 };
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let dim = dims[idx]!;

        let childLayout = layoutElement(child, {
            dimensions: dim, getTextDimensions,
        });
        for (let positioned of childLayout) {
            result.push({
                ...positioned,
                top: positioned.top + offset.top,
                left: positioned.left + offset.left,
            });
        }

        // Increment offset
        if (direction === 'row') {
            offset.left += dim.width;
        } else {
            offset.top += dim.height;
        }
    }

    return result;
}

function getDimensions(element: LayoutElement, getTextDimensions: LayoutContext['getTextDimensions']): Dimensions {
    if (element.kind === 'text') {
        return getTextDimensions(element);
    } else {
        if (element.direction === 'column') {
            return (element.content ?? []).reduce(
                (res, el) => {
                    let dims = getDimensions(el, getTextDimensions);
                    return {
                        width: Math.max(res.width, dims.width),
                        height: res.height + dims.height,
                    };
                },
                { width: 0, height: 0 },
            );
        } else {
            return (element.content ?? []).reduce(
                (res, el) => {
                    let dims = getDimensions(el, getTextDimensions);
                    return {
                        width: res.width + dims.width,
                        height: Math.max(res.height, dims.height),
                    };
                },
                { width: 0, height: 0 },
            );
        }
    }
}

function getGrow(element: LayoutElement): number {
    if (element.kind === 'text') {
        return 0;
    } else {
        return element.grow ?? 0;
    }
}