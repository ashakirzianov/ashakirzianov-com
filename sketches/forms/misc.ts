import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, zoomToFit, rainbow, boundingBox,
    cubicBox, modItem, vals, clearCanvas, scene, boxesForText,
    boxSize, traceAnimator, boxCenter, resolvePrimitiveColor,
    breakIntoLines, vector,
} from '@/sketcher';
import {
    enchanceWithSetI, randomObject, setsScene, xSets, zoomToBoundingBox,
} from './utils';

export function letters(text: string) {
    let maxVelocity = 5;
    let massRange = { min: 0.1, max: 4 };
    let boxes = [cubicBox(500)];
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
            canvas.context.strokeStyle = 'black';
            canvas.context.lineWidth = 0.1;
            let sub = text.at((seti + index) % text.length)!;
            canvas.context.strokeText(sub, object.position.x, object.position.y);
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}

export function letters2(text: string) {
    let lines = breakIntoLines(text, 7);
    let boxes = boxesForText({
        lines,
        getDimensions() {
            return { width: 100, height: 100 };
        },
    });
    let vel = 0;
    let state = boxes.map(({ box, letter }) => {
        let center = boxCenter(box);
        return {
            box,
            letter,
            position: center,
            velocity: vector.random({ min: -vel, max: vel }),
            mass: 5,
            anchor: {
                position: center,
                mass: 1,
            },
            trace: {
                position: [center],
            },
        };
    });
    return scene({
        state,
        animator: (reduceAnimators(
            arrayAnimator(function (object) {
                let direction = vector.sub(object.anchor.position, object.position);
                let step = vector.mults(direction, 0.1);
                let d = .2;
                let rand = vector.random({ min: -d, max: d });
                let vel = vector.add(step, rand);
                return {
                    ...object,
                    velocity: vector.add(object.velocity, vel),
                };
            }),
            velocityStep(),
            arrayAnimator(traceAnimator('position', 30)),
        )),
        layers: [{
            prepare({ canvas, state }) {
                canvas.context.translate(0, -canvas.height / 10);
                let padding = 100;
                let points = state.map(o => o.position);
                let bb = boundingBox(points);
                bb.start = vector.add(bb.start, vector.value(-padding));
                bb.end = vector.add(bb.end, vector.value(padding));
                zoomToFit({ box: bb, canvas });
            },
            render({ canvas, state }) {
                canvas.context.save();
                clearCanvas(canvas);
                canvas.context.textAlign = 'center';
                canvas.context.textBaseline = 'middle';
                canvas.context.font = '10vh sans-serif';
                canvas.context.fillStyle = 'orange';
                canvas.context.lineWidth = .2;
                let palette = rainbow({
                    count: 30, s: 100, l: 50,
                });

                for (let { letter, box, trace } of state) {
                    let size = boxSize(box);
                    canvas.context.strokeStyle = 'rgb(20, 20, 20)';
                    let i = 0;
                    for (let position of trace.position) {
                        canvas.context.strokeStyle = resolvePrimitiveColor(modItem(palette, i++));
                        canvas.context.strokeText(letter, position.x, position.y);
                    }
                }
                canvas.context.restore();
            },
        }],
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