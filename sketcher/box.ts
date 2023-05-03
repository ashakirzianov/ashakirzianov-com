import { Dimensions, Position } from "./layout"
import { randomRange } from "./random"
import { vector, Vector } from "./vector"

export type Box = {
    start: Vector,
    end: Vector,
};

export function boxSize({ start, end }: Box) {
    return {
        width: end.x - start.x,
        height: end.y - start.y,
        depth: end.z - start.z,
    }
}

export function boxRange({ start, end }: Box) {
    return {
        widthRange: { min: start.x, max: end.x },
        heightRange: { min: start.y, max: end.y },
        depthRange: { min: start.z, max: end.z },
    }
}

export function boxCenter(box: Box): Vector {
    return vector.mults(vector.add(box.start, box.end), 0.5)
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
    let { width, height } = boxSize(box)
    let dw = width / cols
    let dh = height / rows
    let row = Math.floor(n / cols)
    let column = n % cols
    let start: Vector = vector.add(
        { x: column * dw, y: row * dh, z: 0 },
        box.start,
    )
    let end = vector.add(
        start,
        { x: dw, y: dh, z: depth ?? 0 },
    )
    return { start, end }
}

export function boundingBox(points: Vector[]): Box {
    let start: Vector = { ...points[0]! }
    let end: Vector = { ...points[0]! }
    for (let point of points) {
        start = vector.map(
            start,
            (v, getter) => Math.min(v, getter(point)),
        )
        end = vector.map(
            end,
            (v, getter) => Math.max(v, getter(point)),
        )
    }
    return { start, end }
}

export function multBox({ start, end }: Box, value: number) {
    return {
        start: vector.mults(start, value),
        end: vector.mults(end, value),
    }
}

// inflateBox returns box with same center but inflated by given value.
export function inflateBox(box: Box, value: number): Box {
    let dx = value * (box.end.x - box.start.x) / 2
    let dy = value * (box.end.y - box.start.y) / 2
    let dz = value * (box.end.z - box.start.z) / 2
    return {
        start: vector.add(box.start, { x: -dx, y: -dy, z: -dz }),
        end: vector.add(box.end, { x: dx, y: dy, z: dz }),
    }
}

export function cubicBox(size: number): Box {
    return rectBox(size, size)
}

export function rectBox(width: number, height: number, depth?: number): Box {
    return {
        start: { x: -width / 2, y: -height / 2, z: -(depth ?? 100) / 2 },
        end: { x: width / 2, y: height / 2, z: (depth ?? 100) / 2 },
    }
}

export function cornerBoxes({ rows, cols }: {
    rows: number,
    cols: number,
}): Box[] {
    let aspect = rows / cols
    let ns = [
        0, cols - 1,
        cols * (rows - 1), cols * rows - 1,
    ]
    return squareBoxes({
        box: rectBox(500 * aspect, 500),
        count: 4, rows, cols,
        getSquareN: n => ns[n]!,
    })
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
        )
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
        )
}

export function randomSubbox({
    box: { start, end }, width, height, depth
}: {
    box: Box,
    width: number,
    height: number,
    depth?: number,
}) {
    let rstart: Vector = {
        x: randomRange({ min: start.x, max: end.x - width }),
        y: randomRange({ min: start.y, max: end.y - height }),
        z: randomRange({ min: start.z ?? 0, max: (end.z ?? 0) - (depth ?? 0) }),
    }
    let rend = vector.add(
        rstart,
        { x: width, y: height, z: (depth ?? 0) },
    )
    return {
        start: rstart,
        end: rend,
    }
}

export function randomVectorInBox({ start, end }: Box) {
    return vector.map(
        start,
        (v, getter) => randomRange({ min: v, max: getter(end) }),
    )
}

export function boxesForText({
    lines, getDimensions, offset,
}: {
    lines: string[],
    getDimensions: (text: string) => Dimensions,
    offset?: Position,
}) {
    let loff = offset?.left ?? 0
    let toff = offset?.top ?? 0
    let boxes = []
    for (let lidx = 0; lidx < lines.length; lidx++) {
        let line = lines[lidx]!
        for (let cidx = 0; cidx < line.length; cidx++) {
            let letter = line[cidx]!
            let { width, height } = getDimensions(letter)
            let left = cidx * width + loff
            let top = lidx * height + toff
            let right = left + width
            let bottom = top + height
            let box: Box = {
                start: vector.fromTuple([left, top, 0]),
                end: vector.fromTuple([right, bottom, 0]),
            }
            boxes.push({
                box, letter: line[cidx]!,
            })
        }
    }
    return boxes
}