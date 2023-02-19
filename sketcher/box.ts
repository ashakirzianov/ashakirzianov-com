import { Box, Vector } from "./base";
import { randomRange } from "./utils";
import vector from "./vector";

export function squareNBox({
    n, rows, columns, width, height, offset, depth,
}: {
    n: number,
    rows: number,
    columns: number,
    width: number,
    height: number,
    offset?: Vector,
    depth?: number,
}): Box {
    let dw = width / columns;
    let dh = height / rows;
    let row = Math.floor(n / columns);
    let column = n % columns;
    let start: Vector = [column * dw, row * dh, 0];
    if (offset) {
        start = vector.add(start, offset);
    }
    let end = vector.add(start, [dw, dh, depth ?? 0]);
    return { start, end };
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
    let rend = vector.add(rstart, [width, height, (depth ?? 0)]);
    return {
        start: rstart,
        end: rend,
    };
}

export function randomVectorInBox({ start, end }: Box) {
    let result: Vector = [0, 0];
    for (let idx = 0; idx < Math.min(start.length, end.length); idx++) {
        let min = start[idx]!;
        let max = end[idx]!;
        result[idx] = randomRange({ min, max });
    }
    return result;
}