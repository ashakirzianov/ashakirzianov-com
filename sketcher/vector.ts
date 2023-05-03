import { randomRange } from "./random"
import { NumRange } from "./range"

export type VectorTuple = readonly [x: number, y: number, z: number];
export type Vector = {
    x: number,
    y: number,
    z: number,
};

function add(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    }
}

function mults({ x, y, z }: Vector, sclar: number): Vector {
    return {
        x: x * sclar,
        y: y * sclar,
        z: z * sclar,
    }
}

function sub(v1: Vector, v2: Vector): Vector {
    return add(v1, mults(v2, -1))
}

function length({ x, y, z }: Vector): number {
    return Math.sqrt(x * x + y * y + z * z)
}

export const vector = {
    add, mults, sub, length,
    value(val: number): Vector {
        return { x: val, y: val, z: val }
    },
    distance(v1: Vector, v2: Vector) {
        return length(sub(v1, v2))
    },
    midpoint(points: Vector[]) {
        let mid = points.reduce(
            (res, curr) => add(res, curr)
        )
        return mults(mid, 1 / points.length)
    },
    random(range: NumRange): Vector {
        return {
            x: randomRange(range),
            y: randomRange(range),
            z: randomRange(range),
        }
    },
    map(
        { x, y, z }: Vector,
        mapFn: (v: number, getter: (v: Vector) => number) => number,
    ) {
        return {
            x: mapFn(x, v => v.x),
            y: mapFn(y, v => v.y),
            z: mapFn(z, v => v.z),
        }
    },
    fromTuple([x, y, z]: VectorTuple): Vector {
        return { x, y, z }
    },
    toTuple({ x, y, z }: Vector): VectorTuple {
        return [x, y, z]
    },
}