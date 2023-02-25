import type { Canvas2DContext } from "./render";
import { Vector2d } from "./vector";

export type StringColor = string;
export type RGBAColor = {
    kind?: undefined,
    r?: number,
    g?: number,
    b?: number,
    a?: number,
};
export type TupleColor = number[];
export type GradientColor = {
    kind: 'gradient',
    start: Vector2d,
    end: Vector2d,
    stops: ColorStop[],
};
export type PrimitiveColor = StringColor | RGBAColor | TupleColor;
export type Color = PrimitiveColor | GradientColor;
export type ColorStop = { offset: number, color: PrimitiveColor };
export type ResolvedColor = StringColor | CanvasGradient;
export type ColorGetter<T> = (x: T) => Color;
export type ColorOrGetter<T> = Color | ColorGetter<T>;

export function getColor<T>(colorOrGetter: ColorOrGetter<T>, x: T) {
    return typeof colorOrGetter === 'function'
        ? colorOrGetter(x)
        : colorOrGetter;
}

export function resolvePrimitiveColor(color: PrimitiveColor): StringColor {
    if (Array.isArray(color)) {
        return fromTupleColor(color);
    } else if (typeof color === 'object') {
        return fromRGBA(color);
    } else {
        return color;
    }
}

export function isPrimitiveColor(color: Color): color is PrimitiveColor {
    return !((color as any)['kind'] === 'gradient');
}

export function resolveColor(color: Color, context: Canvas2DContext): ResolvedColor {
    if (isPrimitiveColor(color)) {
        return resolvePrimitiveColor(color);
    } else {
        let gradient = context.createLinearGradient(
            color.start[0], color.start[1], color.end[0], color.end[1],
        );
        color.stops.forEach(
            ({ offset, color }) => gradient.addColorStop(offset, resolvePrimitiveColor(color)),
        );
        return gradient;
    }
}

const colorMap = {
    orange: { r: 255, g: 165, b: 0 },
};
export function toRGBA(name: keyof typeof colorMap): RGBAColor {
    return colorMap[name];
}

export function gray(value: number): PrimitiveColor {
    return {
        r: value,
        g: value,
        b: value,
    };
}

export function fromRGBA({ r, g, b, a }: RGBAColor): StringColor {
    if (a) {
        return `rgba(${(r ?? 0)},${(g ?? 0)},${(b ?? 0)},${a})`;
    } else {
        return `rgb(${(r ?? 0)},${(g ?? 0)},${(b ?? 0)})`;
    }
}

export function fromTupleColor([r, g, b, a]: TupleColor): StringColor {
    return fromRGBA({ r, g, b, a });
}

export function multRGBA({ r, g, b, a }: RGBAColor, value: number): RGBAColor {
    return {
        r: Math.min(255, Math.floor((r ?? 0) * value)),
        g: Math.min(255, Math.floor((g ?? 0) * value)),
        b: Math.min(255, Math.floor((b ?? 0) * value)),
        a,
    };
}

export function mapStops({ colors, func }: {
    colors: PrimitiveColor[],
    func: (value: number) => number,
}): ColorStop[] {
    let delta = 1 / colors.length;
    return colors.map((color, i) => ({
        offset: func(i * delta),
        color,
    }));
}

export function unifromStops(colors: PrimitiveColor[]): ColorStop[] {
    return mapStops({
        colors,
        func: x => x,
    });
}

export type ColorStopObject = {
    [k in number]: PrimitiveColor;
}
export function makeStops(object: ColorStopObject): ColorStop[] {
    return Object.entries(object).map(
        ([offsetString, color]) => ({
            offset: Number(offsetString),
            color,
        }),
    );
}

export function rainbow({
    count, s, l,
}: {
    count: number,
    s?: number,
    l?: number,
}): Color[] {
    return hueRange({
        count,
        from: 0, to: 360,
        s: s ?? 80, l: l ?? 50,
    });
}

export function hueRange({
    from, to, count, s, l,
}: {
    from: number, to: number, count: number,
    s: number, l: number,
}) {
    let delta = (to - from) / count;
    return Array(count).fill(undefined).map(
        (_, idx) => `hsl(${from + Math.floor(delta * idx)},${s}%,${l}%)`,
    );
}

export function pulsating(palette: Color[]): Color[] {
    let back = [...palette].reverse();
    return [...palette, ...back];
}