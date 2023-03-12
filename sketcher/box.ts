import { randomRange } from "./random";
import { addVector, multsVector, Vector } from "./vector";

export type Box = {
    start: Vector,
    end: Vector,
};

export function boxSize({ start, end }: Box) {
    return {
        width: end[0] - start[0],
        height: end[1] - start[1],
        depth: end[2] - start[2],
    };
}

export function boxRange({ start, end }: Box) {
    return {
        widthRange: { min: start[0], max: end[0] },
        heightRange: { min: start[1], max: end[1] },
        depthRange: { min: start[2], max: end[2] },
    };
}

export function squareNBox({
    n, rows, cols, box, depth,
}: {
    n: number,
    box: Box,
    rows: number,
    cols: number,
    depth?: number,
}): Box {
    let { width, height } = boxSize(box);
    let dw = width / cols;
    let dh = height / rows;
    let row = Math.floor(n / cols);
    let column = n % cols;
    let start: Vector = addVector(
        [column * dw, row * dh, 0],
        box.start,
    );
    let end = addVector(start, [dw, dh, depth ?? 0]);
    return { start, end };
}

export function boundingBox(points: Vector[]): Box {
    let start: Vector = [...points[0]!];
    let end: Vector = [...points[0]!];
    for (let point of points) {
        for (let idx = 0; idx < 3; idx++) {
            start[idx] = Math.min(start[idx]!, point[idx]!);
            end[idx] = Math.max(end[idx]!, point[idx]!);
        }
    }
    return { start, end };
}

export function multBox({ start, end }: Box, value: number) {
    return {
        start: multsVector(start, value),
        end: multsVector(end, value),
    };
}

export function cubicBox(size: number): Box {
    return rectBox(size, size);
}

export function rectBox(width: number, height: number, depth?: number): Box {
    return {
        start: [-width / 2, -height / 2, -(depth ?? 100) / 2],
        end: [width / 2, height / 2, (depth ?? 100) / 2],
    };
}

export function cornerBoxes({ rows, cols }: {
    rows: number,
    cols: number,
}): Box[] {
    let aspect = rows / cols;
    let ns = [
        0, cols - 1,
        cols * (rows - 1), cols * rows - 1,
    ];
    return squareBoxes({
        box: rectBox(500 * aspect, 500),
        count: 4, rows, cols,
        getSquareN: n => ns[n]!,
    });
}

export function squareBoxes({
    count, rows, cols, getSquareN, box,
}: {
    count: number,
    rows: number,
    cols: number,
    getSquareN: (idx: number) => number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            (_, idx) => squareNBox({
                n: getSquareN(idx),
                box,
                depth: boxSize(box).width / cols,
                rows, cols,
            }),
        );
}

export function randomBoxes({ count, size, box }: {
    count: number,
    size: number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            () => randomSubbox({
                box,
                width: size,
                height: size,
                depth: size,
            }),
        );
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