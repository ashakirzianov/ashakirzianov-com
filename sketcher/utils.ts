import { Dimensions, NumRange, Vector } from "./base";

export function mapRange({ from, to, value }: {
    from: NumRange,
    to: NumRange,
    value: number,
}) {
    let perc = (value - from.min) / (from.max - from.min);
    let result = to.min + perc * (to.max - to.min)
    return result;
}

export function randomRange(range: NumRange) {
    return mapRange({
        from: { min: 0, max: 1 },
        to: range,
        value: Math.random(),
    });
}

export function rangeLength({ min, max }: NumRange) {
    return max - min;
}

export function withinRange({
    range: { min, max }, value,
}: {
    range: NumRange,
    value: number,
}) {
    return min < value && value < max;
}

export function withinDimensions({ dimensions, point: [x, y, z] }: {
    dimensions: Dimensions,
    point: Vector,
}) {
    return withinRange({ range: dimensions.x, value: x })
        && withinRange({ range: dimensions.y, value: y })
        && withinRange({ range: dimensions.z, value: z })
        ;
}

export function rangeArray({ min, max }: NumRange) {
    let result = [];
    for (let idx = min; idx < max; idx++) {
        result.push(idx);
    }
    return result;
}