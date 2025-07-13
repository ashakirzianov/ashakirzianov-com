import { Box, boundingBox, cornerBoxes, multBox } from './box'
import { WithPosition, WithVelocity } from './object'
import { Canvas2d, zoomToFit } from './render'
import { Vector, vector } from './vector'

export function removeUndefined<T>(array: Array<T | undefined>): T[] {
    const result: T[] = []
    for (const element of array) {
        if (element !== undefined) {
            result.push(element)
        }
    }
    return result
}

export function modItem<T>(arr: T[], idx: number): T {
    return arr[idx % arr.length]!
}

export function vals<T>(count: number, val?: T): T[] {
    return Array(count).fill(val)
}

export function nums(to: number, from?: number): number[] {
    const result = []
    for (let n = from ?? 0; n < to; n++) {
        result.push(n)
    }
    return result
}

export function breakIntoLines(text: string, lineLength: number): string[] {
    if (lineLength <= 0) {
        return [text]
    }
    const lines = []
    let current = ''
    const words = text.split(' ')
    for (let word of words) {
        while (word.length > lineLength) {
            if (current !== '') {
                lines.push(current)
                current = ''
            }
            const front = word.substring(0, lineLength)
            lines.push(front)
            word = word.substring(lineLength)
        }
        const next = current === '' ? word : `${current} ${word}`
        if (next.length > lineLength) {
            lines.push(current)
            current = word
        } else {
            current = next
        }
    }
    if (current !== '') {
        lines.push(current)
    }
    return lines
}

export function enchanceWithSetI<T>(sets: T[][]) {
    return sets.map(
        (set, seti) => set.map(obj => ({ ...obj, seti }))
    )
}

export function xSets<O extends WithVelocity>({
    size, velocity, creareObjects,
}: {
    size: number,
    velocity: number,
    creareObjects: (box: Box) => O[],
}) {
    const vels: Vector[] = [
        vector.fromTuple([velocity, velocity, 0]),
        vector.fromTuple([-velocity, velocity, 0]),
        vector.fromTuple([velocity, -velocity, 0]),
        vector.fromTuple([-velocity, -velocity, 0]),
    ]
    const boxes = cornerBoxes({ rows: 3 * size, cols: 4 * size })
    return boxes.map((box, bi) => {
        const objects = creareObjects(box)
        return objects.map(object => ({
            ...object,
            velocity: vector.add(object.velocity, vels[bi]!),
        }))
    })
}

export function zoomToBoundingBox({ objects, scale, canvas }: {
    canvas: Canvas2d,
    objects: WithPosition[],
    scale: number,
}) {
    const points = objects.map(o => o.position)
    const box = multBox(boundingBox(points), scale)
    return zoomToFit({ box, canvas })
}

export function filterUndefined<T>(arr: Array<T | undefined>): T[] {
    return arr.filter((x): x is T => x !== undefined)
}