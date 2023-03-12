import { randomRange } from "./random";
import { NumRange } from "./range";

export type VectorTuple = readonly [x: number, y: number, z: number];
export type Vector = {
    x: number,
    y: number,
    z: number,
};

export function addVector(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    };
}

export function multsVector(v: Vector, s: number): Vector {
    return {
        x: v.x * s,
        y: v.y * s,
        z: v.z * s,
    };
}

export function subVector(v1: Vector, v2: Vector): Vector {
    return addVector(v1, multsVector(v2, -1));
}

export function vectorLength({ x, y, z }: Vector): number {
    return Math.sqrt(x * x + y * y + z * z);
}

export function valVector(val?: number): Vector {
    return { x: val ?? 0, y: val ?? 0, z: val ?? 0 };
}

export function distance(v1: Vector, v2: Vector) {
    return vectorLength(subVector(v1, v2));
}

export function midpoint(points: Vector[]) {
    let mid = points.reduce(
        (res, curr) => addVector(res, curr)
    );
    return multsVector(mid, 1 / points.length);
}

export function randomVector(range: NumRange): Vector {
    return {
        x: randomRange(range),
        y: randomRange(range),
        z: randomRange(range),
    };
}

export function mapVector(
    { x, y, z }: Vector,
    map: (v: number, getter: (v: Vector) => number) => number,
) {
    return {
        x: map(x, v => v.x),
        y: map(y, v => v.y),
        z: map(z, v => v.z),
    };
}

export function fromTuple([x, y, z]: VectorTuple): Vector {
    return { x, y, z };
}

export function toTuple({ x, y, z }: Vector): VectorTuple {
    return [x, y, z];
}