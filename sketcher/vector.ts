export type Vector2d = [number, number];
export type Vector = [number, number, number];

export function addVector(v1: Vector, v2: Vector): Vector {
    return v1.map((x, i) => x + (v2[i] ?? 0)) as Vector;
}

export function multsVector(v: Vector, s: number): Vector {
    return v.map(x => x * s) as Vector;
}

export function subVector(v1: Vector, v2: Vector): Vector {
    return addVector(v1, multsVector(v2, -1));
}

export function vectorLength(v: Vector): number {
    let result = Math.sqrt(v.reduce(
        (sum, x) => sum + x ** 2,
        0,
    ));
    return result;
}

export function zeroVector(dimensions: number): Vector {
    return Array(Math.max(2, dimensions)).fill(0) as Vector;
}

export function distance(v1: Vector, v2: Vector) {
    let result = Math.sqrt(
        v1.reduce(
            (sum, x, i) => sum + (x - (v2[i] ?? 0)) ** 2,
            0,
        )
    );
    return result;
}

export function lengthVector(v: Vector) {
    return distance(v, zeroVector(v.length));
}

export function midpoint(points: Vector[]) {
    let mid = points.reduce(
        (res, curr) => addVector(res, curr)
    );
    return multsVector(mid, 1 / points.length);
}