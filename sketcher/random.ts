import { mapRange, NumRange } from "./range";

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