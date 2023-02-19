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

export function randomSubbox({
    box: { start, end }, width, height, depth
}: {
    box: Box,
    width: number,
    height: number,
    depth?: number,
}) {
    let rstart: Vector = [
        randomRange({ min: start[0], max: end[0] - width }),
        randomRange({ min: start[1], max: end[1] - height }),
        randomRange({ min: start[2] ?? 0, max: (end[2] ?? 0) - (depth ?? 0) }),
    ];
    let rend = addVector(rstart, [width, height, (depth ?? 0)]);
    return {
        start: rstart,
        end: rend,
    };
}

export function randomVectorInBox({ start, end }: Box) {
    let result: Vector = [0, 0, 0];
    for (let idx = 0; idx < Math.min(start.length, end.length); idx++) {
        let min = start[idx]!;
        let max = end[idx]!;
        result[idx] = randomRange({ min, max });
    }
    return result;
}