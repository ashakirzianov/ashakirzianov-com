import type { Canvas2DContext } from "./render";
import { Vector2d } from "./vector";

export type StringColor = string;
export type RGBAColor = {
    kind?: undefined,
    red?: number,
    green?: number,
    blue?: number,
    alpha?: number,
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
    orange: { red: 255, green: 165, blue: 0 },
};
export function toRGBA(name: keyof typeof colorMap): RGBAColor {
    return colorMap[name];
}

export function gray(value: number): PrimitiveColor {
    return {
        red: value,
        green: value,
        blue: value,
    };
}

export function fromRGBA({ red, green, blue, alpha }: RGBAColor): StringColor {
    if (alpha) {
        return `rgba(${(red ?? 0)},${(green ?? 0)},${(blue ?? 0)},${alpha})`;
    } else {
        return `rgb(${(red ?? 0)},${(green ?? 0)},${(blue ?? 0)})`;
    }
}

export function fromTupleColor([red, green, blue, alpha]: TupleColor): StringColor {
    return fromRGBA({ red, green, blue, alpha });
}

export function multRGBA({ red, green, blue, alpha }: RGBAColor, value: number): RGBAColor {
    return {
        red: Math.min(255, Math.floor((red ?? 0) * value)),
        green: Math.min(255, Math.floor((green ?? 0) * value)),
        blue: Math.min(255, Math.floor((blue ?? 0) * value)),
        alpha: alpha,
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