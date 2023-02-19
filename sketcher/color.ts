import {
    Color, RGBAColor, TupleColor, ColorStop, ResolvedColor,
} from './base';

export function resolveColor(color: Color): ResolvedColor {
    if (Array.isArray(color)) {
        return fromTupleColor(color);
    } else if (typeof color === 'object') {
        return fromRGBA(color);
    } else {
        return color;
    }
}

const colorMap = {
    orange: { red: 255, green: 165, blue: 0 },
};
export function toRGBA(name: keyof typeof colorMap): RGBAColor {
    return colorMap[name];
}

export function gray(value: number): ResolvedColor {
    return fromRGBA({
        red: value,
        green: value,
        blue: value,
    });
}

export function fromRGBA({ red, green, blue, alpha }: RGBAColor): ResolvedColor {
    if (alpha) {
        return `rgba(${(red ?? 0)},${(green ?? 0)},${(blue ?? 0)},${alpha})`;
    } else {
        return `rgb(${(red ?? 0)},${(green ?? 0)},${(blue ?? 0)})`;
    }
}

export function fromTupleColor([red, green, blue, alpha]: TupleColor): ResolvedColor {
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
    colors: ResolvedColor[],
    func: (value: number) => number,
}): ColorStop[] {
    let delta = 1 / colors.length;
    return colors.map((color, i) => ({
        offset: func(i * delta),
        color,
    }));
}

export function unifromStops(colors: ResolvedColor[]): ColorStop[] {
    return mapStops({
        colors,
        func: x => x,
    });
}

export type ColorStopObject = {
    // TODO: change to color?
    [k in number]: ResolvedColor;
}
export function makeStops(object: ColorStopObject): ColorStop[] {
    return Object.entries(object).map(
        ([offsetString, color]) => ({
            offset: Number(offsetString),
            color,
        }),
    );
}

export function rainbow(count: number): Color[] {
    let delta = 360 / count;
    return Array(count).fill(undefined).map(
        (_, idx) => `hsl(${Math.floor(delta * idx)},80%,50%)`,
    );
}