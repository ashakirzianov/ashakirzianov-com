import {
    Animator, WithMass, WithPosition, WithVelocity,
} from './base';
import vector from './vector';


type LawState<ObjectT> = ObjectT[];
type Law<ObjectT> = Animator<LawState<ObjectT>>;

export function velocityStep<ObjectT extends WithVelocity & WithPosition>(): Law<ObjectT> {
    return function velocityLaw(objects) {
        let next = objects.map(object => ({
            ...object,
            position: vector.add(object.position, object.velocity),
        }));
        return next;
    }
}

export function preserveMomentum<ObjectT extends WithVelocity & WithMass>(law: Law<ObjectT>): Law<ObjectT> {
    function calculateMomentum(objects: LawState<ObjectT>) {
        let momentum = objects.reduce(
            (sum, obj) => sum + vector.length(obj.velocity) * obj.mass,
            0,
        );
        return momentum;
    }

    return function preserveLaw(objects) {
        let momentum = calculateMomentum(objects);
        let next = law(objects);
        let nextmom = calculateMomentum(next);
        let coef = momentum / nextmom;
        for (let object of objects) {
            object.velocity = vector.mults(object.velocity, coef);
        }
        return next;
    };
}

export type GravityProps = {
    gravity: number,
    power: number,
};
export function gravity<ObjectT extends WithVelocity & WithMass & WithPosition>({ gravity, power }: GravityProps): Law<ObjectT> {
    function force(o1: ObjectT, o2: ObjectT) {
        let dist = vector.distance(o1.position, o2.position);
        let direction = vector.sub(o1.position, o2.position);
        let mass = o1.mass * o2.mass;
        let multiplier = (mass * gravity) / (dist ** power);
        let result = vector.mults(direction, multiplier);
        return result;
    }

    return function gravityLaw(objects) {
        objects = objects.map(obj => ({ ...obj }));
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
        return objects;
    }
}

export function combineLaws<ObjectT>(...laws: Law<ObjectT>[]): Law<ObjectT> {
    return function combined(state) {
        return laws.reduce(
            (s, law) => law(s),
            state,
        );
    };
}