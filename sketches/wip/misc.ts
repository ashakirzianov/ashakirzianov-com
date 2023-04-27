import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, rainbow, cubicBox, modItem, vals,
    resolvePrimitiveColor, gray, scene, clearFrame, renderMask, renderPositionedElement, layoutOnCanvas, fromLayers, colorLayer, combineScenes, layoutAndRender, TextLayout,
    enchanceWithSetI, randomObject, xSets, zoomToBoundingBox,
} from '@/sketcher';

import { molecules } from './molecules';
import { pastelCircles } from './pastel';

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
    return scene({
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas, state }) {
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.2
                });
            },
            render({ canvas, state }) {
                state.forEach((set, seti) => set.forEach(
                    (object, index) => {
                        canvas.context.font = '20vh sans-serif';
                        canvas.context.lineWidth = .1;
                        let sub = text.at((seti + index) % text.length)!;
                        canvas.context.strokeStyle = 'black';
                        canvas.context.strokeText(sub, object.position.x, object.position.y);
                        canvas.context.fillStyle = resolvePrimitiveColor(gray(230));
                        // canvas.context.fillText(sub, object.position.x, object.position.y);
                    }
                ))
            }
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
                        let fill = modItem(palette, 100 * object.seti + frame + 20);
                        circle({
                            lineWidth: 0.2,
                            fill: fill,
                            stroke: 'black',
                            position: object.position,
                            radius: object.radius * 3,
                            context: canvas.context,
                        });
                    }
                ))
            }
        }],
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
                        let fill = modItem(palette, object.seti * 100 + frame);
                        circle({
                            lineWidth: 0.5,
                            fill,
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

export function pink() {
    return combineScenes(
        fromLayers(colorLayer('white')),
        pastelCircles(),
        fromLayers({
            prepare({ canvas }) {
                let font = {
                    fontSize: 20,
                    bold: true,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'end',
                    crossJustify: 'stretch',
                    padding: 2,
                    content: [
                        {

                            justify: 'start',
                            padding: {
                                top: 0,
                                bottom: 20,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Gentlest of all colors',
                                fontSize: 1,
                                color: 'black',
                                rotation: -Math.PI / 2
                            }],
                        },
                        {
                            justify: 'center',
                            crossJustify: 'end',
                            padding: {
                                bottom: 20,
                                top: 0,
                            },
                            content: [{
                                content: [{
                                    id: 'large-text',
                                    text: 'Pink',
                                    ...font,
                                }]
                            }],
                        },
                    ],
                });

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!;
                let large = layout.find(p => p.element.id === 'large-text')!;
                let side = large.dimensions.width;
                let x = large.position.left;
                let y = small.position.top + small.dimensions.height - side;

                clearFrame({ canvas, color: 'pink' });
                renderMask(canvas.context, context => {
                    context.fillRect(x, y, side, side);
                });

                for (let positioned of layout) {
                    renderPositionedElement({ canvas, positioned });
                }
            },
        }),
    );
}

export function sm() {
    // Reference: https://www.stedelijk.nl/en/collection/31791-josje-pollmann-wim-crouwel-zeven-grafici-uit-joegoslavie
    return fromLayers(
        colorLayer([220, 63, 66]),
        {
            prepare({ canvas }) {
                let font = {
                    fontSize: 34.5,
                    bold: true,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'end',
                    crossJustify: 'stretch',
                    content: [
                        {
                            justify: 'start',
                            padding: {
                                top: 0,
                                bottom: 20,
                                left: 2,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Zeven grafici uit Joegosiavië',
                                fontSize: .8,
                                color: 'black',
                                rotation: -Math.PI / 2,
                            }],
                        },
                        {
                            justify: 'end',
                            crossJustify: 'end',
                            padding: {
                                right: 2,
                                top: 0,
                                bottom: 3,
                            },
                            content: [{
                                content: [{
                                    id: 'left-letter',
                                    text: 'S',
                                    ...font,
                                    offset: -3,
                                    crossOffset: -2,
                                },
                                {
                                    id: 'right-letter',
                                    text: 'M',
                                    ...font,
                                }]
                            }],
                        },
                    ],
                });

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!;
                let left = layout.find(p => p.element.id === 'left-letter')!;
                let right = layout.find(p => p.element.id === 'right-letter')!;
                let delta = .0;
                let rightX = right.position.left + right.dimensions.width * (1 - delta);
                let leftX = left.position.left + left.dimensions.width * delta;
                let side = rightX - leftX;
                let bottomY = small.position.top + small.dimensions.height;
                let x = leftX;
                let y = bottomY - side;

                clearFrame({ canvas, color: [228, 101, 79] });
                canvas.context.clearRect(x, y, side, side);

                for (let positioned of layout) {
                    renderPositionedElement({ canvas, positioned });
                }
            },
        },
    );
}

export function helloWorld() {
    return fromLayers({/* TODO: why do we need this emply layer? */ }, {
        render({ canvas, frame }) {
            clearFrame({ canvas, color: 'black' });
            let root: TextLayout = {
                content: [
                    {
                        padding: .1,
                        grow: 1,
                        direction: 'column',
                        border: 'orange',
                        justify: 'start',
                        crossJustify: 'end',
                        content: [
                            {
                                text: 'hello',
                                color: 'yellow',
                                rotation: -frame * 0.2,
                            },
                            {
                                text: 'world',
                                border: 'red',
                            },
                        ],
                    },
                    {
                        grow: 0,
                        border: 'blue',
                        direction: 'column',
                        crossJustify: 'center',
                        content: [
                            {
                                grow: 3,
                                border: 'magenta',
                            },
                            {
                                text: 'Here we go',
                                border: 'green',
                                rotation: frame * 0.1,
                            },
                            {
                                grow: 1,
                            },
                        ],
                    }
                ],
            };
            canvas.context.lineWidth = 5;
            layoutAndRender({
                canvas, root, style: {
                    fontSize: 5,
                    fontFamily: 'serif',
                    color: 'red',
                }
            });
        },
    });
}

export function alina() {
    return combineScenes(
        fromLayers(colorLayer(gray(30))),
        slinky(),
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

export function styleIsTheAnswer() {
    return combineScenes(
        fromLayers(colorLayer('black')),
        molecules(),
        fromLayers({
            prepare({ canvas }) {
                let font = {
                    fontSize: 15,
                    smallCaps: true,
                    bold: true,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'space-between',
                    crossJustify: 'center',
                    padding: {
                        top: 30,
                    },
                    content: [{
                        text: 'Style',
                        ...font,
                    }, {
                        text: 'is the',
                        ...font,
                    }, {
                        text: 'answer',
                        ...font,
                    }],
                });

                clearFrame({ canvas, color: 'black' });
                renderMask(canvas.context, context => {
                    for (let positioned of layout) {
                        renderPositionedElement({ canvas, positioned });
                    }
                });
            },
        }),
    );
}