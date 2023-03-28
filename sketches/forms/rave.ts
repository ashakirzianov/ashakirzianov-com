import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals, concentringCircles,
} from '@/sketcher';
import {
    randomObject, setsScene, xSets, zoomToBoundingBox,
} from './utils';

export function rave() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 120, s: 100, l: 70 });
    let sets = xSets({
        size: 1, velocity: 1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }));
        },
    });
    return setsScene({
        sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        drawObject({ canvas, frame, object, seti }) {
            let offset = seti * 30 + frame;
            let fills = vals(5).map(
                (_, i) => modItem(palette, offset - 3 * i)
            );
            concentringCircles({
                context: canvas.context,
                position: object.position,
                radius: object.radius,
                fills,
            });
        },
        prerender({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}