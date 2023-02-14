import { Vector, NumRange } from './base';
import { randomRange } from './utils';

export function add(v1: Vector, v2: Vector): Vector {
    return v1.map((x, i) => x + v2[i]);
}

export function mults(v: Vector, s: number): Vector {
    return v.map(x => x * s);
}

export function sub(v1: Vector, v2: Vector): Vector {
    return add(v1, mults(v2, -1));
}

export function random3d(range: NumRange): Vector {
    return zero(3).map(
        () => randomRange(range)
    );
}

export function zero(dimensions: number): Vector {
    let result: number[] = [];
    for (let i = 0; i < dimensions; i++) {
        result.push(0);
    }
    return result;
}

export function distance(v1: Vector, v2: Vector) {
    let result = Math.sqrt(
        v1.reduce(
            (sum, x, i) => sum + (x - v2[i]) ** 2,
            0,
        )
    );
    return result;
}

export function length(v: Vector) {
    return distance(v, zero(v.length));
}

export default {
    add, sub, mults, random3d, zero, distance,
    length,
};