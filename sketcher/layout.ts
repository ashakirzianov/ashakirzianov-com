export type Dimensions = {
    width: number,
    height: number,
};
export type Position = {
    left: number,
    top: number,
};
export type Justification = 'start' | 'center' | 'end'
    | 'space-between' | 'space-around' | 'space-evenly';
export type CrossJustification = 'start' | 'center' | 'end' | 'stretch';
export type LayoutDirection = 'row' | 'column';
export type LayoutSize = number;
export type LayoutPadding = LayoutSize | {
    left?: LayoutSize,
    right?: LayoutSize,
    top?: LayoutSize,
    bottom?: LayoutSize,
};
export type LayoutElement<T> = T & {
    id?: string,
    content?: LayoutElement<T>[],
    grow?: number,
    direction?: LayoutDirection,
    justify?: Justification,
    crossJustify?: CrossJustification,
    padding?: LayoutPadding,
    margin?: LayoutPadding,
    offset?: LayoutSize,
    crossOffset?: LayoutSize,
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
    root: LayoutElement<T>,
    { dimensions, resolveDimensions }: LayoutContext<T>,
): PositionedLayout<T> {
    let result: PositionedLayout<T> = [];

    // Set defaults
    let content = root.content ?? [];
    let justify = root.justify ?? 'center';
    let crossJustify = root.crossJustify ?? 'stretch';
    let direction = root.direction ?? 'row';
    let padding = resolvePadding(root.padding ?? 0);

    let withPadding = subPadding(dimensions, padding);
    // Conver to dimensions relative to direction
    let { main, cross } = toRelative(withPadding, direction);

    // Offset from props:
    let extraOffset = {
        main: calcSize(root.offset ?? 0, main),
        cross: calcSize(root.crossOffset ?? 0, cross),
    };

    // Add self
    result.push({
        element: root,
        dimensions,
        position: addToPosition({ left: 0, top: 0 }, extraOffset, direction),
    });

    // Apply padding
    let paddingOffset = toRelative({
        width: calcSize(padding.left, dimensions.width),
        height: calcSize(padding.top, dimensions.height),
    }, direction);

    // Calculate growth
    let dims = content.map(el => toRelative(getDimensions(el, resolveDimensions), direction));
    let contentMain = dims.reduce((r, d) => r + d.main, 0);
    let totalGrow = content.reduce((r, e) => r + (e.grow ?? 0), 0);
    let extraLength = Math.max(0, main - contentMain);
    let growUnit = totalGrow === 0 ? 0 : extraLength / totalGrow;

    // Grow content dimensions
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let growLength = (child.grow ?? 0) * growUnit;
        dims[idx]!.main += growLength;
        if (crossJustify === 'stretch') {
            dims[idx]!.cross = cross;
        }
    }

    function calcOffset(justify: Justification, main: number, dims: RelativeDimensions[]) {
        let adjustedMain = dims.reduce((r, d) => r + d.main, 0);
        let diff = main - adjustedMain;
        switch (justify) {
            case 'start':
                return { offsetMain: 0, offsetStep: 0 };
            case 'end':
                return { offsetMain: diff, offsetStep: 0 };
            case 'space-between':
                return dims.length < 2
                    ? { offsetMain: diff / 2, offsetStep: 0 }
                    : { offsetMain: 0, offsetStep: diff / (dims.length - 1) };
            case 'space-around':
                let around = diff / ((dims.length - 1) * 2 + 2);
                return dims.length < 2
                    ? { offsetMain: diff / 2, offsetStep: 0 }
                    : { offsetMain: around, offsetStep: 2 * around };
            case 'space-evenly':
                let evenly = diff / (dims.length + 1);
                return dims.length < 2
                    ? { offsetMain: diff / 2, offsetStep: 0 }
                    : { offsetMain: evenly, offsetStep: evenly };
            case 'center':
            default:
                return { offsetMain: diff / 2, offsetStep: 0 };
        }
    }
    let { offsetMain, offsetStep } = calcOffset(justify, main, dims);
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let dim = dims[idx]!;

        let childLayout = layoutElement(child, {
            dimensions: toAbsolute(dim, direction), resolveDimensions,
        });
        for (let positioned of childLayout) {
            let relative = toRelative(positioned.dimensions, direction);
            let offset = {
                main: offsetMain,
                cross: crossJustify === 'start' ? 0
                    : crossJustify === 'end' ? cross - relative.cross
                        : crossJustify === 'center' ? (cross - relative.cross) / 2
                            : 0,
            };
            offset.main += paddingOffset.main;
            offset.cross += paddingOffset.cross;
            result.push({
                ...positioned,
                position: addToPosition(positioned.position, offset, direction),
            })
        }

        // Increment offset
        offsetMain += dim.main + offsetStep;
    }

    return result;
}

function getDimensions<T>(element: LayoutElement<T>, resolveDimensions: LayoutContext<T>['resolveDimensions']): Dimensions {
    let direction = element.direction ?? 'row';
    let padding = resolvePadding(element.padding ?? 0);
    let resolved = resolveDimensions(element);
    if (resolved) {
        return addPadding(resolved, padding);
    }
    let relative = (element.content ?? []).reduce(
        (res, el) => {
            let dims = getDimensions(el, resolveDimensions);
            let rel = toRelative(dims, direction);
            return {
                main: res.main + rel.main,
                cross: Math.max(res.cross, rel.cross),
            };
        },
        { main: 0, cross: 0 },
    );
    let absolute = toAbsolute(relative, direction);
    let withPadding = addPadding(absolute, padding);

    return withPadding;
}

function addPadding(dimensions: Dimensions, padding: LayoutPadding) {
    let resolved = resolvePadding(padding);
    return {
        width: dimensions.width / (1 - resolved.left - resolved.right),
        height: dimensions.height / (1 - resolved.top - resolved.bottom),
    };
}
function subPadding(dimensions: Dimensions, padding: LayoutPadding) {
    let resolved = resolvePadding(padding);
    return {
        width: dimensions.width - calcSize(resolved.left, dimensions.width) - calcSize(resolved.right, dimensions.width),
        height: dimensions.height - calcSize(resolved.top, dimensions.height) - calcSize(resolved.bottom, dimensions.height),
    };
}

type RelativeDimensions = {
    main: number,
    cross: number,
};
function toRelative(dimensions: Dimensions, direction: LayoutDirection): RelativeDimensions {
    return direction === 'row'
        ? { main: dimensions.width, cross: dimensions.height }
        : { main: dimensions.height, cross: dimensions.width };
}
function toAbsolute(relative: RelativeDimensions, direction: LayoutDirection): Dimensions {
    return direction === 'row'
        ? { width: relative.main, height: relative.cross }
        : { width: relative.cross, height: relative.main };
}
function addToPosition(position: Position, relative: RelativeDimensions, direction: LayoutDirection): Position {
    return direction === 'row'
        ? { left: position.left + relative.main, top: position.top + relative.cross }
        : { left: position.left + relative.cross, top: position.top + relative.main };
}

function sumRelative(left: RelativeDimensions, right: RelativeDimensions): RelativeDimensions {
    return {
        main: left.main + right.main,
        cross: left.cross + right.cross,
    };
}

function calcSize(size: LayoutSize, axis: number) {
    return size * axis;
}

function resolvePadding(padding: LayoutPadding) {
    if (typeof padding === 'number') {
        return {
            left: padding, right: padding,
            top: padding, bottom: padding,
        };
    } else {
        return {
            left: padding.left ?? padding.right ?? 0,
            right: padding.right ?? padding.left ?? 0,
            top: padding.top ?? padding.bottom ?? 0,
            bottom: padding.bottom ?? padding.top ?? 0,
        };
    }
}