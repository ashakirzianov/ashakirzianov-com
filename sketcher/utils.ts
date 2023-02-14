import { NumRange } from "./base";

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