import { NumRange, Vector } from "./base";

export function mapRange({ from, to, value }: {
    from: NumRange,
    to: NumRange,
    value: number,
}) {
    let perc = (value - from.min) / (from.max - from.min);
    let result = to.min + perc * (to.max - to.min)
    return result;
}

export function randomRange(range: Partial<NumRange>) {
    return mapRange({
        from: { min: 0, max: 1 },
        to: { min: range.min ?? 0, max: range.max ?? 0 },
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
    dimensions: {
        x: NumRange, y: NumRange, z: NumRange,
    },
    point: Vector,
}) {
    return withinRange({ range: dimensions.x, value: x })
        && withinRange({ range: dimensions.y, value: y })
        && withinRange({ range: dimensions.z, value: z ?? 0 })
        ;
}

export function rangeArray({ min, max }: NumRange) {
    let result = [];
    for (let idx = min; idx < max; idx++) {
        result.push(idx);
    }
    return result;
}