import { addVector, Vector } from "./vector";

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
    n, rows, columns, box, depth,
}: {
    n: number,
    box: Box,
    rows: number,
    columns: number,
    depth?: number,
}): Box {
    let { width, height } = boxSize(box);
    let dw = width / columns;
    let dh = height / rows;
    let row = Math.floor(n / columns);
    let column = n % columns;
    let start: Vector = addVector(
        [column * dw, row * dh, 0],
        box.start,
    );
    let end = addVector(start, [dw, dh, depth ?? 0]);
    return { start, end };
}