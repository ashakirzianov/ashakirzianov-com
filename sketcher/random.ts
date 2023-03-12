import { Box } from "./box";
import { mapRange, NumRange } from "./range";
import { addVector, Vector, zeroVector } from "./vector";

export function randomVector(range: NumRange): Vector {
    return zeroVector(3).map(
        () => randomRange(range)
    ) as Vector;
}

export function randomRange(range: Partial<NumRange>) {
    return mapRange({
        from: { min: 0, max: 1 },
        to: { min: range.min ?? 0, max: range.max ?? 0 },
        value: Math.random(),
    });
}

export function randomItem<T>(arr: T[]): T {
    let idx = randomInt(arr.length);
    return arr[idx]!;
}

export function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}