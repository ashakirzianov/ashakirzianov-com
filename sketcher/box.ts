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