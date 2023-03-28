import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals,
    concentringCircles, clearCanvas,
} from '@/sketcher';
import {
    enchanceWithSetI, randomObject, setsScene, xSets, zoomToBoundingBox,
} from './utils';

export function bubbles() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 0.1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 100, s: 100, l: 70 });
    let sets = enchanceWithSetI(xSets({
        size: 10, velocity: 0.1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }));
        },
    }));
    return setsScene({
        sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        drawObject({ canvas, object, frame }) {
            let offset = object.seti * 30 + frame;
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
            clearCanvas(canvas);
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}

export function bubblesFlat() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 0.1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 100, s: 100, l: 70 });
    let sets = enchanceWithSetI(xSets({
        size: 10, velocity: 0.1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }));
        },
    }));
    return setsScene({
        sets: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        drawObject({ canvas, object, frame }) {
            let offset = object.seti * 30 + frame;
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
            clearCanvas(canvas);
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}