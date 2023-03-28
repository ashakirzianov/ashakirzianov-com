import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals, combineScenes, fromLayers, clearFrame,
} from '@/sketcher';
import {
    enchanceWithSetI, randomObject, setsScene, xSets, zoomToBoundingBox,
} from './utils';

export function example() {
    let back = rainbow({ count: 120, s: 40, l: 70 });
    return combineScenes(
        fromLayers({
            render({ canvas, frame }) {
                clearFrame({
                    canvas,
                    color: modItem(back, frame),
                });
            },
        }),
        pastelCircles(),
    )
}

export function pastelCircles() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 120, s: 80, l: 70 });
    let back = rainbow({ count: 120, s: 40, l: 70 });
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
    return setsScene({
        sets: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        drawObject({ canvas, object, frame }) {
            let n = 5;
            for (let i = 0; i < n; i++) {
                let offset = frame + object.seti * 100 + i * 20;
                let fill = modItem(palette, offset);
                let next = modItem(palette, offset + 10);
                circle({
                    lineWidth: 5,
                    fill: fill,
                    stroke: next,
                    position: object.position,
                    radius: object.radius * i,
                    context: canvas.context,
                });
            }
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}