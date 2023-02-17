import { Animator, WithMass, WithObjects, WithPosition, WithVelocity } from './base';
import vector from './vector';

// TODO: rethink this file to animators
type LawObject = WithPosition & WithVelocity & WithMass;
type LawState = WithObjects<LawObject>;
type Law<State extends LawState> = Animator<State>;

export function velocityStep<State extends LawState>(): Law<State> {
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

export function preserveMomentum<State extends LawState>(law: Law<State>): Law<State> {
    function calculateMomentum(state: LawState) {
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
export function gravity<State extends LawState>({ gravity, power }: GravityProps): Law<State> {
    function force(o1: LawObject, o2: LawObject) {
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

export function combineLaws<State extends LawState>(...laws: Law<State>[]): Law<State> {
    return function combined(state) {
        return laws.reduce(
            (s, law) => law(s),
            state,
        );
    };
}