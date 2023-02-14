import { Universe, UniverseObject } from './base';
import vector from './vector';

export type LawState = {
    universe: Universe,
};
export type Law = (props: LawState) => LawState;

export function velocityStep(): Law {
    return function velocityLaw({ universe }) {
        let next = {
            ...universe,
            objects: universe.objects.map(object => ({
                ...object,
                position: vector.add(object.position, object.velocity),
            })),
        };
        return { universe: next };
    }
}

export function preserveMomentum(law: Law): Law {
    function calculateMomentum({ universe }: LawState) {
        let momentum = universe.objects.reduce(
            (sum, obj) => sum + vector.length(obj.velocity) * obj.mass,
            0,
        );
        return momentum;
    }

    return function preserveLaw(state) {
        let momentum = calculateMomentum(state);
        let next = law(state);
        let nextmom = calculateMomentum(next);
        let coef = momentum / nextmom;
        for (let object of next.universe.objects) {
            object.velocity = vector.mults(object.velocity, coef);
        }
        return next;
    };
}

export type GravityProps = {
    gravity: number,
    power: number,
};
export function gravity({ gravity, power }: GravityProps): Law {
    function force(o1: UniverseObject, o2: UniverseObject) {
        let dist = vector.distance(o1.position, o2.position);
        let direction = vector.sub(o1.position, o2.position);
        let mass = o1.mass * o2.mass;
        let multiplier = (mass * gravity) / (dist ** power);
        let result = vector.mults(direction, multiplier);
        return result;
    }

    return function gravityLaw({ universe }) {
        let objects = universe.objects.map(obj => ({ ...obj }));
        for (let left = 0; left < objects.length; left++) {
            for (let right = 0; right < objects.length; right++) {
                if (left === right) {
                    continue;
                }
                let lobj = objects[left];
                let robj = objects[right];
                let f = force(robj, lobj);
                lobj.velocity = vector.add(lobj.velocity, f);
            }
        }
        let result = {
            universe: {
                ...universe,
                objects,
            },
        };
        return result;
    }
}

export function combineLaws(...laws: Law[]) {
    return function combined(state: LawState) {
        return laws.reduce(
            (s, law) => law(s),
            state,
        );
    };
}