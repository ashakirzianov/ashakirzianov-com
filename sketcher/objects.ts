import {
    Animator, NumRange, WithMass, WithPosition, WithRadius, WithVelocity,
} from './base';
import { randomRange, randomVector } from './random';
import {
    addVector, distance, lengthVector, multsVector, subVector,
} from './vector';


type Objects<ObjectT> = ObjectT[];
type ObjectAnimator<ObjectT> = Animator<Objects<ObjectT>>;
type FullObject = WithPosition & WithVelocity & WithMass & WithRadius;

type ObjectMap<Keys extends keyof FullObject, T> = {
    [k in Keys]: T;
};
export function randomObjects<Keys extends keyof FullObject>(count: number, props: ObjectMap<Keys, NumRange>): Pick<FullObject, Keys>[] {
    return Array(count).fill(undefined).map(() => {
        let object: any = {};
        let {
            position, velocity, radius, mass,
        } = props as ObjectMap<keyof FullObject, NumRange | undefined>;
        if (position) {
            object.position = randomVector(position);
        }
        if (velocity) {
            object.velocity = randomVector(velocity);
        }
        if (radius) {
            object.radius = randomRange(radius);
        }
        if (mass) {
            object.mass = randomRange(mass);
        }
        return object;
    });
}

export function createObjects({
    count, position, velocity, radius, mass,
}: {
    count: number,
    position: NumRange,
    velocity: NumRange,
    radius: NumRange,
    mass: NumRange,
}): FullObject[] {
    return Array(count).fill(undefined).map(() => {
        return {
            position: randomVector(position),
            velocity: randomVector(velocity),
            radius: randomRange(radius),
            mass: randomRange(mass),
        };
    });
}

export function velocityStep<ObjectT extends WithVelocity & WithPosition>(): ObjectAnimator<ObjectT> {
    return function velocityLaw(objects) {
        let next = objects.map(object => ({
            ...object,
            position: addVector(object.position, object.velocity),
        }));
        return next;
    }
}

export function preserveMomentum<ObjectT extends WithVelocity & WithMass>(law: ObjectAnimator<ObjectT>): ObjectAnimator<ObjectT> {
    function calculateMomentum(objects: Objects<ObjectT>) {
        let momentum = objects.reduce(
            (sum, obj) => sum + lengthVector(obj.velocity) * obj.mass,
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
            object.velocity = multsVector(object.velocity, coef);
        }
        return next;
    };
}

export type GravityProps = {
    gravity: number,
    power: number,
};
export function gravity<ObjectT extends WithVelocity & WithMass & WithPosition>({ gravity, power }: GravityProps): ObjectAnimator<ObjectT> {
    function force(o1: ObjectT, o2: ObjectT) {
        let dist = distance(o1.position, o2.position);
        let direction = subVector(o1.position, o2.position);
        let mass = o1.mass * o2.mass;
        let multiplier = (mass * gravity) / (dist ** power);
        let result = multsVector(direction, multiplier);
        return result;
    }

    return function gravityLaw(objects) {
        objects = objects.map(obj => ({ ...obj }));
        for (let left = 0; left < objects.length; left++) {
            for (let right = 0; right < objects.length; right++) {
                if (left === right) {
                    continue;
                }
                let lobj = objects[left]!;
                let robj = objects[right]!;
                let f = force(robj, lobj);
                lobj.velocity = addVector(lobj.velocity, f);
            }
        }
        return objects;
    }
}