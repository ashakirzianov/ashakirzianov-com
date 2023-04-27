import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, cubicBox, vals, scene, randomObject, zoomToBoundingBox, combineScenes, fromLayers, colorLayer, makeStops, gray, fromRGBA,
} from '@/sketcher';

export function knot() {
    return combineScenes(
        fromLayers(colorLayer({
            kind: 'gradient',
            start: [0, 0], end: [0, 1],
            stops: makeStops({
                0: gray(180),
                0.2: fromRGBA({ r: 230, g: 230, b: 230 }),
            }),
        })),
        form(),
    );
}

function form() {
    let box = cubicBox(200);
    let batchRange = { min: 20, max: 20 };
    let maxVelocity = 0.4;
    let massRange = { min: 0.5, max: 5 };
    let batch = Math.floor(randomRange(batchRange));
    let set = vals(batch).map(() => randomObject({
        massRange, maxVelocity, box,
        rToM: 1,
    }));
    return scene({
        state: [set],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.06, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas, state }) {
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.2
                });
            },
            render({ canvas, state }) {
                state.forEach(set => set.forEach(
                    object => {
                        circle({
                            lineWidth: 0.5,
                            fill: 'orange',
                            stroke: 'black',
                            position: object.position,
                            radius: object.radius,
                            context: canvas.context,
                        });
                    }
                ))
            }
        }],
    });
}