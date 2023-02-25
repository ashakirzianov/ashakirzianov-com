import {
    velocityStep, gravity, circle, WithPosition, WithVelocity,
    reduceAnimators, arrayAnimator, Box, randomSubbox,
    randomVectorInBox, randomRange, squareNBox, zoomToFit,
    rainbow, randomVector, boundingBox, clearFrame, multBox, gray,
    multRGBA, Color, cubicBox, NumRange, Canvas,
    boxSize, modItem, rectBox, hueRange, pulsating, Vector, vals,
    subVector, addVector, makeStops, fromRGBA, setsScene, Render,
    resultingBody,
    concentringCircles,
    getGravity,
} from '@/sketcher';

// TODO: fix typing
export const variations: any[] = [
    molecules(),
    bubbles(),
    bubblesFlat(),
    fittedRainbow(),
    strokedRainbows(),
    pastelRainbows(),
    rainbowSpring(),
    rainbowStrings(),
    randomBatches(),
    original(),
];

export function current() {
    return molecules();
}

export function playground() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 10;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 100, s: 100, l: 70 });
    return setsScene({
        sets: enchanceWithSetI(xSets({
            size: 10, velocity: 0,
            creareObjects(box) {
                let batch = Math.floor(randomRange(batchRange));
                return vals(batch).map(() => randomObject({
                    massRange, maxVelocity, box,
                    rToM: 2,
                }));
            },
        })),
        animator: reduceAnimators(
            arrayAnimator(reduceAnimators(
                gravity({ gravity: -0.0008, power: 1 }),
                velocityStep(),
            )),
            function (state) {
                let bodies = state.map(resultingBody);
                for (let fromi = 0; fromi < state.length; fromi++) {
                    for (let toi = fromi + 1; toi < state.length; toi++) {
                        let from = bodies[fromi]!;
                        let to = bodies[toi]!;
                        let force = getGravity({
                            gravity: 0.00002, power: 1,
                            from, to,
                        });
                        for (let object of state[fromi]!) {
                            object.velocity = addVector(object.velocity, force);
                        }
                        for (let object of state[toi]!) {
                            object.velocity = subVector(object.velocity, force);
                        }
                    }
                }
                return state;
            },
        ),
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
            clearFrame({ canvas, color: 'black' });
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
            // canvas.context.strokeStyle = 'red';
            // canvas.context.lineWidth = 10;
            // canvas.context.strokeRect(
            //     box.start[0], box.start[1],
            //     box.end[0] - box.start[0], box.end[1] - box.start[1],
            // );
            // canvas.context.strokeStyle = 'green';
            // for (let set of state) {
            //     let bb = boundingBox(set.map((o: any) => o.position));

            //     canvas.context.strokeRect(
            //         bb.start[0], bb.start[1],
            //         bb.end[0] - bb.start[0], bb.end[1] - bb.start[1],
            //     );
            // }
        },
    });
}

export function molecules() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 10;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 100, s: 100, l: 70 });
    return setsScene({
        sets: enchanceWithSetI(xSets({
            size: 10, velocity: 0,
            creareObjects(box) {
                let batch = Math.floor(randomRange(batchRange));
                return vals(batch).map(() => randomObject({
                    massRange, maxVelocity, box,
                    rToM: 2,
                }));
            },
        })),
        animator: reduceAnimators(
            arrayAnimator(reduceAnimators(
                gravity({ gravity: 0.0015, power: 1 }),
                velocityStep(),
            )),
            function (state) {
                let bodies = state.map(resultingBody);
                for (let fromi = 0; fromi < state.length; fromi++) {
                    for (let toi = fromi + 1; toi < state.length; toi++) {
                        let from = bodies[fromi]!;
                        let to = bodies[toi]!;
                        let force = getGravity({
                            gravity: 0.00002, power: 1,
                            from, to,
                        });
                        for (let object of state[fromi]!) {
                            object.velocity = addVector(object.velocity, force);
                        }
                        for (let object of state[toi]!) {
                            object.velocity = subVector(object.velocity, force);
                        }
                    }
                }
                return state;
            },
        ),
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
            clearFrame({ canvas, color: 'black' });
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}

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
            clearFrame({ canvas, color: 'black' });
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
            clearFrame({ canvas, color: 'black' });
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}

export function fittedRainbow() {
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
        background: staticBackground('black'),
    });
}

export function strokedRainbows() {
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
        background: staticBackground('black'),
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
    });
}

export function pastelRainbows() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 120, s: 80, l: 70 });
    let back = rainbow({ count: 120, s: 40, l: 70 });
    //     let batch = Math.floor(randomRange(batchRange));
    //     return vals(batch).map(function () {
    //         let obj = randomObject({
    //             massRange, maxVelocity, box,
    //             rToM: 2,
    //         });
    //         obj.velocity = addVector(obj.velocity, vels[bi]!);
    //         return obj;
    //     });
    // }));
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
        background: {
            render({ canvas, frame }) {
                clearFrame({
                    canvas,
                    color: modItem(back, frame),
                });
            }
        }
    });
}

export function rainbowSpring() {
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
    let back = pulsating(hueRange({
        from: 0, to: 360, count: 200,
        s: 50, l: 90,
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
                lineWidth: 1,
                fill,
                stroke,
                position: object.position,
                radius: object.radius,
                context: canvas.context,
            });
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.5 });
        },
        background: {
            render({ canvas, frame }) {
                clearFrame({ canvas, color: modItem(back, frame) });
            },
        },
    });
}

export function rainbowStrings() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 0.1, max: 4 };
    let backPalette = pulsating(hueRange({
        from: 0, to: 360, count: 200,
        s: 50, l: 90,
    }));
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
        background: {
            render({ canvas, frame }) {
                clearFrame({ canvas, color: modItem(backPalette, frame) });
            },
        },
    });
}

export function randomBatches() {
    let batchRange = { min: 5, max: 20 };
    let batches = 7;
    let maxVelocity = 5;
    let massRange = { min: 0.1, max: 4 };
    let boxes = randomBoxes({
        box: cubicBox(500),
        size: 250,
        count: batches,
    });
    let sets = boxes.map(box => {
        let batch = Math.floor(randomRange(batchRange));
        return Array(batch).fill(undefined).map(
            () => randomObject({
                massRange, maxVelocity, box, rToM: 4,
            }),
        );
    });
    let palette: Color[] = [
        '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
    ];
    return setsScene({
        sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            velocityStep(),
        )),
        drawObject({ canvas, object, seti }) {
            circle({
                lineWidth: 0.5,
                fill: modItem(palette, seti),
                stroke: 'black',
                position: object.position,
                radius: object.radius,
                context: canvas.context,
            });
        },
        prepare({ canvas, state }) {
            clearFrame({ canvas, color: gray(230) });
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}

export function original() {
    let box = cubicBox(200);
    let batchRange = { min: 20, max: 20 };
    let maxVelocity = 0.4;
    let massRange = { min: 0.5, max: 5 };
    let complimentary = { r: 230, g: 230, b: 230 };
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
        background: staticBackground({
            kind: 'gradient',
            start: [0, 0], end: [0, 1],
            stops: makeStops({
                0: fromRGBA(complimentary),
                0.7: fromRGBA(multRGBA(complimentary, 1.2)),
                1: gray(50),
            }),
        }),
    });
}

function enchanceWithSetI<T>(sets: T[][]) {
    return sets.map(
        (set, seti) => set.map(obj => ({ ...obj, seti }))
    );
}

function xSets<O extends WithVelocity>({
    size, velocity, creareObjects,
}: {
    size: number,
    velocity: number,
    creareObjects: (box: Box) => O[],
}) {
    let vels: Vector[] = [
        [velocity, velocity, 0],
        [-velocity, velocity, 0],
        [velocity, -velocity, 0],
        [-velocity, -velocity, 0],
    ];
    let boxes = cornerBoxes({ rows: 3 * size, cols: 4 * size });
    return boxes.map((box, bi) => {
        let objects = creareObjects(box);
        return objects.map(object => ({
            ...object,
            velocity: addVector(object.velocity, vels[bi]!),
        }));
    });
}

function cornerBoxes({ rows, cols }: {
    rows: number,
    cols: number,
}): Box[] {
    let aspect = rows / cols;
    let ns = [
        0, cols - 1,
        cols * (rows - 1), cols * rows - 1,
    ];
    return squareBoxes({
        box: rectBox(500 * aspect, 500),
        count: 4, rows, cols,
        getSquareN: n => ns[n]!,
    });
}

function squareBoxes({
    count, rows, cols, getSquareN, box,
}: {
    count: number,
    rows: number,
    cols: number,
    getSquareN: (idx: number) => number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            (_, idx) => squareNBox({
                n: getSquareN(idx),
                box,
                depth: boxSize(box).width / cols,
                rows, cols,
            }),
        );
}

function randomBoxes({ count, size, box }: {
    count: number,
    size: number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            () => randomSubbox({
                box,
                width: size,
                height: size,
                depth: size,
            }),
        );
}

function randomObject({
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
        velocity: randomVector(velocityRange),
        mass,
        radius: mass * (rToM ?? 4),
    };
}

function zoomToBoundingBox({ sets, scale, canvas }: {
    canvas: Canvas,
    sets: WithPosition[][],
    scale: number,
}) {
    let points = sets.flat().map(o => o.position);
    let box = multBox(boundingBox(points), scale);
    zoomToFit({ box, canvas });
}

function staticBackground(color: Color) {
    let prepare: Render<unknown> = ({ canvas }) => {
        clearFrame({ canvas, color });
    };
    return { prepare };
}