import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, cubicBox, vals,
} from '@/sketcher';
import {
    randomObject, setsScene, zoomToBoundingBox,
} from './utils';

export function knot() {
    let box = cubicBox(200);
    let batchRange = { min: 20, max: 20 };
    let maxVelocity = 0.4;
    let massRange = { min: 0.5, max: 5 };
    let batch = Math.floor(randomRange(batchRange));
    let set = vals(batch).map(() => randomObject({
        massRange, maxVelocity, box,
        rToM: 1,
    }));
    return setsScene({
        sets: [set],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.06, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        drawObject({ canvas, object }) {
            circle({
                lineWidth: 0.5,
                fill: 'orange',
                stroke: 'black',
                position: object.position,
                radius: object.radius,
                context: canvas.context,
            });
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}