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
    root: LayoutElement<T>,
    { dimensions, resolveDimensions }: LayoutContext<T>,
): PositionedLayout<T> {
    let result: PositionedLayout<T> = [];

    // Add self
    result.push({
        element: root,
        // dimensions: resolveDimensions(root) ?? dimensions,
        dimensions,
        position: { top: 0, left: 0 },
    });

    // Set defaults
    let content = root.content ?? [];
    let justify = root.justify ?? 'center';
    let crossJustify = root.crossJustify ?? 'center';
    let dir = root.direction ?? 'row';

    // Calculate growth
    // let main = direction === 'row'
    //     ? dimensions.width : dimensions.height;
    // let cross = direction === 'row'
    //     ? dimensions.height : dimensions.width;
    let { main, cross } = toRelative(dimensions, dir);
    let dims = content.map(el => toRelative(getDimensions(el, resolveDimensions), dir));
    let contentMain = dims.reduce((r, d) => r + d.main, 0);
    let totalGrow = content.reduce((r, e) => r + (e.grow ?? 0), 0);
    let extraLength = Math.max(0, main - contentMain);
    let growUnit = totalGrow === 0 ? 0 : extraLength / totalGrow;

    // Grow content dimensions
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let growLength = (child.grow ?? 0) * growUnit;
        dims[idx]!.main += growLength;
        // TODO: respect cross-justification
        dims[idx]!.cross = cross;
    }

    let adjustedMain = dims.reduce((r, d) => r + d.main, 0);
    let offsetMain = justify === 'start' ? 0
        : justify === 'end' ? main - adjustedMain
            : (main - adjustedMain) / 2; // 'center'
    for (let idx = 0; idx < content.length; idx++) {
        let child = content[idx]!;
        let dim = dims[idx]!;

        let childLayout = layoutElement(child, {
            dimensions: toAbsolute(dim, dir), resolveDimensions,
        });
        for (let positioned of childLayout) {
            result.push({
                ...positioned,
                position: addToPosition(positioned.position, {
                    main: offsetMain,
                    cross: 0,
                }, dir),
            })
        }

        // Increment offset
        offsetMain += dim.main;
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
        : { left: position.left + relative.cross, top: position.top + relative.main }
}