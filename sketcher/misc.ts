import { Box, boundingBox, cornerBoxes, multBox } from "./box";
import { WithPosition, WithVelocity } from "./object";
import { Canvas, zoomToFit } from "./render";
import { Vector, vector } from "./vector";

export function removeUndefined<T>(array: Array<T | undefined>): T[] {
    let result: T[] = [];
    for (let element of array) {
        if (element !== undefined) {
            result.push(element);
        }
    }
    return result;
}

export function modItem<T>(arr: T[], idx: number): T {
    return arr[idx % arr.length]!;
}

export function vals<T>(count: number, val?: T): T[] {
    return Array(count).fill(val);
}

export function nums(to: number, from?: number): number[] {
    let result = [];
    for (let n = from ?? 0; n < to; n++) {
        result.push(n);
    }
    return result;
}

export function breakIntoLines(text: string, lineLength: number): string[] {
    if (lineLength <= 0) {
        return [text];
    }
    let lines = [];
    let current = '';
    let words = text.split(' ');
    for (let word of words) {
        while (word.length > lineLength) {
            if (current !== '') {
                lines.push(current);
                current = '';
            }
            let front = word.substring(0, lineLength);
            lines.push(front);
            word = word.substring(lineLength);
        }
        let next = current === '' ? word : `${current} ${word}`;
        if (next.length > lineLength) {
            lines.push(current);
            current = word;
        } else {
            current = next;
        }
    }
    if (current !== '') {
        lines.push(current);
    }
    return lines;
}

export function enchanceWithSetI<T>(sets: T[][]) {
    return sets.map(
        (set, seti) => set.map(obj => ({ ...obj, seti }))
    );
}

export function xSets<O extends WithVelocity>({
    size, velocity, creareObjects,
}: {
    size: number,
    velocity: number,
    creareObjects: (box: Box) => O[],
}) {
    let vels: Vector[] = [
        vector.fromTuple([velocity, velocity, 0]),
        vector.fromTuple([-velocity, velocity, 0]),
        vector.fromTuple([velocity, -velocity, 0]),
        vector.fromTuple([-velocity, -velocity, 0]),
    ];
    let boxes = cornerBoxes({ rows: 3 * size, cols: 4 * size });
    return boxes.map((box, bi) => {
        let objects = creareObjects(box);
        return objects.map(object => ({
            ...object,
            velocity: vector.add(object.velocity, vels[bi]!),
        }));
    });
}

export function zoomToBoundingBox({ objects, scale, canvas }: {
    canvas: Canvas,
    objects: WithPosition[],
    scale: number,
}) {
    let points = objects.map(o => o.position);
    let box = multBox(boundingBox(points), scale);
    zoomToFit({ box, canvas });
}