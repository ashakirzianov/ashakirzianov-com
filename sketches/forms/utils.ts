import {
    WithPosition, WithVelocity, Box, randomVectorInBox,
    randomRange, zoomToFit, boundingBox, multBox, NumRange, Canvas,
    Vector, Render, Animator, Scene, cornerBoxes, vector,
} from '@/sketcher';

export function enchanceWithSetI<T>(sets: T[][]) {
    return sets.map(
        (set, seti) => set.map(obj => ({ ...obj, seti }))
    );
}

export function xSets<O extends WithVelocity>({
    size, velocity, creareObjects,
}: {
    size: number,
    velocity: number,
    creareObjects: (box: Box) => O[],
}) {
    let vels: Vector[] = [
        vector.fromTuple([velocity, velocity, 0]),
        vector.fromTuple([-velocity, velocity, 0]),
        vector.fromTuple([velocity, -velocity, 0]),
        vector.fromTuple([-velocity, -velocity, 0]),
    ];
    let boxes = cornerBoxes({ rows: 3 * size, cols: 4 * size });
    return boxes.map((box, bi) => {
        let objects = creareObjects(box);
        return objects.map(object => ({
            ...object,
            velocity: vector.add(object.velocity, vels[bi]!),
        }));
    });
}

export function randomObject({
    massRange, maxVelocity, box, rToM,
}: {
    box: Box,
    massRange: NumRange,
    maxVelocity: number,
    rToM: number,
}) {
    let mass = randomRange(massRange);
    let velocityRange = {
        min: -maxVelocity, max: maxVelocity,
    };
    return {
        position: randomVectorInBox(box),
        velocity: vector.random(velocityRange),
        mass,
        radius: mass * (rToM ?? 4),
    };
}

export function zoomToBoundingBox({ sets, scale, canvas }: {
    canvas: Canvas,
    sets: WithPosition[][],
    scale: number,
}) {
    let points = sets.flat().map(o => o.position);
    let box = multBox(boundingBox(points), scale);
    zoomToFit({ box, canvas });
}

type DrawObjectProps<O> = {
    canvas: Canvas,
    frame: number,
    object: O,
    seti: number,
    index: number,
};
type DrawObject<O> = (props: DrawObjectProps<O>) => void;
type State<O> = O[][];
export function setsScene<O>({
    sets, animator, drawObject, prepare, prerender,
}: {
    sets: O[][],
    animator: Animator<O[][]>,
    drawObject: DrawObject<O>,
    prepare?: Render<O[][]>,
    prerender?: Render<O[][]>,
}): Scene<State<O>> {
    return {
        state: sets,
        animator,
        layers: [{}, {
            prepare({ canvas, state, frame }) {
                if (prepare) {
                    prepare({ canvas, state, frame });
                }
            },
            render({ canvas, state, frame }) {
                canvas.context.save();
                if (prerender) {
                    prerender({ canvas, state, frame });
                }
                for (let seti = 0; seti < state.length; seti++) {
                    let set = state[seti]!;
                    for (let index = 0; index < set.length; index++) {
                        let object = set[index]!;
                        drawObject({
                            canvas, frame, object, seti, index,
                        });
                    }
                }
                canvas.context.restore();
            }
        }],
    };
}