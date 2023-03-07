export type Dimensions = {
    width: number,
    height: number,
};
export type Position = {
    top: number,
    left: number,
};
export type Justification = 'start' | 'center' | 'end';
export type LayoutDirection = 'row' | 'column';
export type LayoutElement<T> = T & {
    id?: string,
    content?: LayoutElement<T>[],
    grow?: number,
    direction?: LayoutDirection,
    justify?: Justification,
    crossJustify?: Justification,
};
export type PositionedElement<T> = {
    element: LayoutElement<T>,
    position: Position,
    dimensions: Dimensions,
};
export type PositionedLayout<T> = PositionedElement<T>[];
export type LayoutContext<T> = {
    dimensions: Dimensions,
    resolveDimensions: (element: T) => Dimensions | undefined,
};

export function layoutElement<T>(
    flex: LayoutElement<T>,
    { dimensions, resolveDimensions }: LayoutContext<T>,
): PositionedLayout<T> {
    let result: PositionedLayout<T> = [];

    // Add self
    result.push({
        element: flex,
        dimensions: { ...dimensions },
        position: { top: 0, left: 0 },
    });

    // Set defaults
    let content = flex.content ?? [];
    let direction = flex.direction ?? 'row';
    let justify = flex.justify ?? 'center';

    // Calculate growth
    let flexLength = direction === 'row'
        ? dimensions.width : dimensions.height;
    let dims = content.map(el => getDimensions(el, resolveDimensions));
    let contentLength = direction === 'row'
        ? dims.reduce((r, d) => r + d.width, 0)
        : dims.reduce((r, d) => r + d.height, 0);
    let totalGrow = content.reduce((r, e) => r + (e.grow ?? 0), 0);
    let extraLength = Math.max(0, flexLength - contentLength);
    let growUnit = totalGrow === 0 ? 0 : extraLength / totalGrow;

    // Grow content dimensions
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let growLength = (child.grow ?? 0) * growUnit;
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
            dimensions: dim, resolveDimensions,
        });
        for (let positioned of childLayout) {
            result.push({
                ...positioned,
                position: {
                    top: positioned.position.top + offset.top,
                    left: positioned.position.left + offset.left,
                },
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

function getDimensions<T>(element: LayoutElement<T>, resolveDimensions: LayoutContext<T>['resolveDimensions']): Dimensions {
    let resolved = resolveDimensions(element);
    if (resolved) {
        return resolved;
    }
    if (element.direction === 'column') {
        return (element.content ?? []).reduce(
            (res, el) => {
                let dims = getDimensions(el, resolveDimensions);
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
                let dims = getDimensions(el, resolveDimensions);
                return {
                    width: res.width + dims.width,
                    height: Math.max(res.height, dims.height),
                };
            },
            { width: 0, height: 0 },
        );
    }
}