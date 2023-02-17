import { Animator, StateType, StateObject } from './base';
import vector from './vector';

type Law = Animator;

export function velocityStep(): Law {
    return function velocityLaw(state) {
        let next = {
            ...state,
            objects: state.objects.map(object => ({
                ...object,
                position: vector.add(object.position, object.velocity),
            })),
        };
        return next;
    }
}

export function preserveMomentum(law: Law): Law {
    function calculateMomentum(state: StateType) {
        let momentum = state.objects.reduce(
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
        for (let object of state.objects) {
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
    function force(o1: StateObject, o2: StateObject) {
        let dist = vector.distance(o1.position, o2.position);
        let direction = vector.sub(o1.position, o2.position);
        let mass = o1.mass * o2.mass;
        let multiplier = (mass * gravity) / (dist ** power);
        let result = vector.mults(direction, multiplier);
        return result;
    }

    return function gravityLaw(state) {
        let objects = state.objects.map(obj => ({ ...obj }));
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
            ...state,
            objects,
        };
        return result;
    }
}

export function combineLaws(...laws: Law[]): Law {
    return function combined(state) {
        return laws.reduce(
            (s, law) => law(s),
            state,
        );
    };
}