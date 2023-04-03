import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, rainbow, cubicBox, modItem, vals,
    resolvePrimitiveColor, gray,
} from '@/sketcher';
import {
    enchanceWithSetI, randomObject, setsScene, xSets, zoomToBoundingBox,
} from './utils';

export function letters(text: string) {
    let maxVelocity = 5;
    let massRange = { min: 0.1, max: 4 };
    let boxes = [cubicBox(600)];
    let sets = boxes.map(box => {
        let batch = text.length;
        return vals(batch).map(
            () => randomObject({
                massRange, maxVelocity, box, rToM: 4,
            }),
        );
    });
    return setsScene({
        sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            velocityStep(),
        )),
        drawObject({ canvas, object, seti, index }) {
            canvas.context.font = '20vh sans-serif';
            canvas.context.lineWidth = .1;
            let sub = text.at((seti + index) % text.length)!;
            canvas.context.strokeStyle = 'black';
            canvas.context.strokeText(sub, object.position.x, object.position.y);
            canvas.context.fillStyle = resolvePrimitiveColor(gray(230));
            // canvas.context.fillText(sub, object.position.x, object.position.y);
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}

export function strokedSlinky() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 120 });
    let sets = enchanceWithSetI(xSets({
        size: 1, velocity: 1,
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
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        drawObject({ canvas, frame, object }) {
            let fill = modItem(palette, 100 * object.seti + frame + 20);
            circle({
                lineWidth: 0.2,
                fill: fill,
                stroke: 'black',
                position: object.position,
                radius: object.radius * 3,
                context: canvas.context,
            });
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}

export function slinky() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 1, max: 20 };
    let sets = enchanceWithSetI(xSets({
        size: 1, velocity: 1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }));
        }
    }));
    let palette = rainbow({ count: 120 });
    return setsScene({
        sets: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        drawObject({ canvas, frame, object }) {
            let offset = object.seti * 100 + frame;
            let fill = modItem(palette, offset);
            let stroke = modItem(palette, offset + 4);
            circle({
                lineWidth: 3,
                stroke,
                position: object.position,
                radius: object.radius,
                context: canvas.context,
            });
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}

export function rainbowStrings() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 0.1, max: 4 };
    let sets = enchanceWithSetI(xSets({
        size: 1, velocity: 1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }));
        }
    }));
    let palette = rainbow({ count: 120 });
    return setsScene({
        sets: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        drawObject({ canvas, frame, object }) {
            let fill = modItem(palette, object.seti * 100 + frame);
            circle({
                lineWidth: 0.5,
                fill,
                stroke: 'black',
                position: object.position,
                radius: object.radius,
                context: canvas.context,
            });
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}