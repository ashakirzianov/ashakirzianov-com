import { Animator } from './animator';
import { Color } from './color';
import { randomRange } from './random';
import { NumRange } from './range';
import { Vector, vector } from './vector';

export type GravityObject = WithPosition & WithMass;
export type WithPosition = { position: Vector };
export type WithVelocity = { velocity: Vector };
export type WithMass = { mass: number };
export type WithRadius = { radius: number };
export type WithColor = { color: Color };
export type WithAnchor = { anchor: GravityObject };


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
            object.position = vector.random(position);
        }
        if (velocity) {
            object.velocity = vector.random(velocity);
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
            position: vector.random(position),
            velocity: vector.random(velocity),
            radius: randomRange(radius),
            mass: randomRange(mass),
        };
    });
}

export function velocityStep<ObjectT extends WithVelocity & WithPosition>(): ObjectAnimator<ObjectT> {
    return function velocityLaw(objects) {
        let next = objects.map(object => ({
            ...object,
            position: vector.add(object.position, object.velocity),
        }));
        return next;
    }
}

export function preserveMomentum<ObjectT extends WithVelocity & WithMass>(law: ObjectAnimator<ObjectT>): ObjectAnimator<ObjectT> {
    function calculateMomentum(objects: Objects<ObjectT>) {
        let momentum = objects.reduce(
            (sum, obj) => sum + vector.length(obj.velocity) * obj.mass,
            0,
        );
        return momentum;
    }

    return function preserveLaw(objects, frame) {
        let momentum = calculateMomentum(objects);
        let next = law(objects, frame);
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
export function getGravity({ gravity, power, from, to }: {
    gravity: number,
    power: number,
    from: GravityObject,
    to: GravityObject,
}): Vector {
    let direction = vector.sub(to.position, from.position);
    let dist = vector.length(direction);
    if (dist === 0) {
        return vector.value(0);
    }
    let multiplier = (from.mass * to.mass * gravity) / (dist ** power);
    let result = vector.mults(direction, multiplier);
    return result;
}

export function gravity<ObjectT extends WithVelocity & WithMass & WithPosition>({ gravity, power }: GravityProps): ObjectAnimator<ObjectT> {
    return function gravityLaw(objects) {
        objects = objects.map(obj => ({ ...obj }));
        for (let fromi = 0; fromi < objects.length; fromi++) {
            for (let toi = fromi + 1; toi < objects.length; toi++) {
                let from = objects[fromi]!;
                let to = objects[toi]!;
                let force = getGravity({
                    gravity, power, from, to,
                });
                from.velocity = vector.add(from.velocity, force);
                to.velocity = vector.sub(to.velocity, force);
            }
        }
        return objects;
    }
}

export function resultingBody(objects: GravityObject[]): GravityObject {
    let result = objects.reduce(
        (sum, curr) => ({
            position: vector.add(sum.position, vector.mults(curr.position, curr.mass)),
            mass: sum.mass + curr.mass,
        }),
        { position: vector.value(0), mass: 0 },
    );
    return result;
}

export type AnchorObject = WithAnchor & GravityObject & WithVelocity;
export function pullToAnchor<O extends AnchorObject>({
    gravity, power,
}: GravityProps): Animator<O> {
    return function pullAnimator(state) {
        let force = getGravity({
            gravity, power, from: state, to: state.anchor,
        });
        return {
            ...state,
            position: vector.add(state.position, force),
        };
    };
}