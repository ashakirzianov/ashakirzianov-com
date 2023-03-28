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
export type LayoutUnit = 'perc' | 'pt'
    | 'ew' | 'eh'
    | 'vw' | 'vh';
export type LayoutSize = number
    | readonly [value: number, unit?: LayoutUnit];
export type LayoutPadding = LayoutSize | {
    kind?: 'unresolved',
    left?: LayoutSize,
    right?: LayoutSize,
    top?: LayoutSize,
    bottom?: LayoutSize,
};
export type LayoutElement<T> = T & {
    id?: string,
    content?: readonly LayoutElement<T>[],
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
    position: Position,
    dimensions: Dimensions,
    view: Dimensions,
    resolveDimensions: (element: T) => Dimensions | undefined,
};

export function layoutElement<T>(
    root: LayoutElement<T>,
    { position, dimensions, view, resolveDimensions }: LayoutContext<T>,
): PositionedLayout<T> {
    let result: PositionedLayout<T> = [];

    // Set defaults
    let content = root.content ?? [];
    let justify = root.justify ?? 'center';
    let crossJustify = root.crossJustify ?? 'stretch';
    let direction = root.direction ?? 'row';
    let sizeEnv: SizeEnvironment = {
        element: dimensions,
        view,
    };
    let padding = resolvePadding(root.padding ?? 0, sizeEnv);

    // Conver to dimensions relative to direction
    let { main, cross } = toRelative({
        width: dimensions.width - padding.left - padding.right,
        height: dimensions.height - padding.top - padding.bottom,
    }, direction);

    // Offset from props:
    let extraOffset = {
        main: resolveSize(
            root.offset ?? 0,
            direction === 'row' ? 'horizontal' : 'vertical',
            sizeEnv,
        ),
        cross: resolveSize(
            root.crossOffset ?? 0,
            direction === 'row' ? 'vertical' : 'horizontal',
            sizeEnv,
        ),
    };

    // Add self
    result.push({
        element: root,
        dimensions,
        position: addToPosition(position, extraOffset, direction),
    });

    // Apply padding
    let paddingOffset = toRelative({
        width: padding.left,
        height: padding.top,
    }, direction);

    // Calculate growth
    let dims = content.map(
        el => toRelative(
            getDimensions(el, resolveDimensions, sizeEnv),
            direction,
        ),
    );
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

        let offset = {
            main: offsetMain,
            cross: crossJustify === 'start' ? 0
                : crossJustify === 'end' ? cross - dim.cross
                    : crossJustify === 'center' ? (cross - dim.cross) / 2
                        : 0,
        };
        offset.main += paddingOffset.main;
        offset.cross += paddingOffset.cross;

        let childLayout = layoutElement(child, {
            position: addToPosition(position, offset, direction),
            dimensions: toAbsolute(dim, direction),
            view,
            resolveDimensions,
        });
        result.push(...childLayout);

        // Increment offset
        offsetMain += dim.main + offsetStep;
    }

    return result;
}

function getDimensions<T>(
    element: LayoutElement<T>,
    resolveDimensions: LayoutContext<T>['resolveDimensions'],
    env: SizeEnvironment,
): Dimensions {
    let resolved = resolveDimensions(element);
    if (resolved) {
        return addPadding(
            resolved,
            element.padding ?? 0,
            { ...env, element: resolved },
        );
    }
    let direction = element.direction ?? 'row';
    let relative = (element.content ?? []).reduce(
        (res, el) => {
            let dims = getDimensions(el, resolveDimensions, env);
            let rel = toRelative(dims, direction);
            return {
                main: res.main + rel.main,
                cross: Math.max(res.cross, rel.cross),
            };
        },
        { main: 0, cross: 0 },
    );
    let absolute = toAbsolute(relative, direction);
    let withPadding = addPadding(
        absolute,
        element.padding ?? 0,
        { ...env, element: absolute },
    );

    return withPadding;
}

function addPadding(dimensions: Dimensions, padding: LayoutPadding, env: SizeEnvironment) {
    let resolved = resolvePadding(padding, env);
    return {
        width: dimensions.width + resolved.left + resolved.right,
        height: dimensions.height + resolved.top + resolved.bottom,
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

export type SizeEnvironment = {
    element: Dimensions,
    view: Dimensions,
};
type SizeDirection = 'horizontal' | 'vertical';
function resolveSize(size: LayoutSize, direction: SizeDirection, env: SizeEnvironment): number {
    if (typeof size === 'number') {
        return resolveSize([size], direction, env);
    } else {
        let [value, unit] = size;
        switch (unit) {
            case undefined:
                return resolveSize([value, 'perc'], direction, env);
            case 'pt':
                return value;
            case 'eh':
                return value * env.element.height;
            case 'ew':
                return value * env.element.width;
            case 'vh':
                return value * env.view.height;
            case 'vw':
                return value * env.view.width;
            case 'perc':
                return direction === 'horizontal'
                    ? value * env.element.width / 100
                    : value * env.element.height / 100;
        }
    }
}

type ResolvedPadding = {
    kind: 'resolved',
    top: number, bottom: number,
    left: number, right: number,
};
function resolvePadding(padding: LayoutPadding, env: SizeEnvironment): ResolvedPadding {
    if (typeof padding === 'number') {
        return resolvePadding([padding], env);
    } else if (isReadonlyArray(padding)) {
        return resolvePadding({
            top: padding, bottom: padding,
            left: padding, right: padding,
        }, env);
    } else {
        return {
            kind: 'resolved',
            left: resolveSize(
                padding.left ?? padding.right ?? 0, 'horizontal', env,
            ),
            right: resolveSize(
                padding.right ?? padding.left ?? 0, 'horizontal', env,
            ),
            top: resolveSize(
                padding.top ?? padding.bottom ?? 0, 'vertical', env,
            ),
            bottom: resolveSize(
                padding.bottom ?? padding.top ?? 0, 'vertical', env,
            ),
        };
    }
}

function isReadonlyArray(obj: any): obj is readonly any[] {
    return Array.isArray(obj);
}