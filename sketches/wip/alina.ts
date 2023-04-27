import {
    vals, gray, clearFrame, renderMask, renderPositionedElement,
    layoutOnCanvas, fromLayers, colorLayer, combineScenes,
    arrayAnimator, circle, enchanceWithSetI, gravity, modItem, rainbow,
    randomObject, randomRange, reduceAnimators, scene, velocityStep,
    xSets, zoomToBoundingBox
} from '@/sketcher';

import { molecules } from './molecules';

export function alina() {
    return combineScenes(
        fromLayers(colorLayer(gray(30))),
        form(),
        fromLayers({
            prepare({ canvas }) {
                let delta = 10;
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'space-evenly',
                    crossJustify: 'center',
                    content: vals(4, 'Alina').map((text, n) => ({
                        text,
                        fontSize: 16,
                        smallCaps: true,
                        italic: true,
                        bold: true,
                        color: 'white',
                        offset: -3 / 2 * delta + n * delta,
                    })),
                });

                clearFrame({ canvas, color: 'pink' });
                renderMask(canvas.context, context => {
                    for (let positioned of layout) {
                        renderPositionedElement({ canvas, positioned });
                    }
                });
            },
        }),
    );
}

function form() {
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
    return scene({
        state: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas, state }) {
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.5
                });
            },
            render({ canvas, state, frame }) {
                state.forEach(set => set.forEach(
                    object => {
                        let offset = object.seti * 100 + frame;
                        let stroke = modItem(palette, offset + 4);
                        circle({
                            lineWidth: 3,
                            stroke,
                            position: object.position,
                            radius: object.radius,
                            context: canvas.context,
                        });
                    }
                ))
            }
        }]
    });
}