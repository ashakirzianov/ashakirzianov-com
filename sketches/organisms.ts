import {
    velocityStep, gravity, circle, WithPosition, WithVelocity,
    reduceAnimators, arrayAnimator, Box, randomVectorInBox,
    randomRange, zoomToFit, rainbow, randomVector, boundingBox,
    multBox, Color, cubicBox, NumRange, Canvas, modItem,
    Vector, vals, subVector, addVector, Render, resultingBody,
    concentringCircles, getGravity, clearCanvas, Animator, Scene, cornerBoxes, randomBoxes, scene, boxesForText, zeroVector, clearFrame, boxSize, traceAnimator,
} from '@/sketcher';

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
            clearCanvas(canvas);
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

export function pastelSlinky() {
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

export function balanced(batches?: number) {
    let batchRange = { min: 5, max: 20 };
    let maxVelocity = 5;
    let massRange = { min: 0.1, max: 4 };
    let boxes = randomBoxes({
        box: cubicBox(500),
        size: 250,
        count: batches ?? 7,
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
    });
}

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
            canvas.context.strokeText(sub, object.position[0], object.position[1]);
        },
        prepare({ canvas, state }) {
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}

export function letters2(text: string) {
    let boxes = boxesForText({
        text, lineLength: 7,
        letterWidth: 100, letterHeight: 100,
    });
    let state = boxes.map(({ box, letter }) => {
        return {
            box,
            letter,
            position: box.start,
            velocity: randomVector({ min: -.5, max: .5 }),
            mass: 5,
            trace: {
                position: [box.start],
            },
        };
    });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            gravity({ gravity: -0.02, power: 5 }),
            velocityStep(),
            arrayAnimator(traceAnimator('position', 100)),
        )),
        layers: [{
            prepare({ canvas, state }) {
                let points = state.map(o => o.position);
                let box = multBox(boundingBox(points), 1.2);
                zoomToFit({ box, canvas });
            },
            render({ canvas, state }) {
                canvas.context.save();
                clearFrame({ canvas, color: 'white' })
                canvas.context.textAlign = 'left';
                canvas.context.textBaseline = 'top';
                canvas.context.font = '10vh sans-serif';
                canvas.context.strokeStyle = 'black';
                canvas.context.fillStyle = 'orange';
                canvas.context.lineWidth = .2;
                for (let { letter, box, trace } of state) {
                    for (let position of trace.position) {
                        canvas.context.strokeText(letter, position[0], position[1]);
                    }
                    let size = boxSize(box);
                    canvas.context.strokeRect(box.start[0], box.start[1], size.width, size.height);
                }
                canvas.context.restore();
            },
        }],
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

type DrawObjectProps<O> = {
    canvas: Canvas,
    frame: number,
    object: O,
    seti: number,
    index: number,
};
type DrawObject<O> = (props: DrawObjectProps<O>) => void;
type State<O> = O[][];
function setsScene<O>({
    sets, animator, drawObject, prepare, prerender,
}: {
    sets: O[][],
    animator: Animator<O[][]>,
    drawObject: DrawObject<O>,
    prepare?: Render<O[][]>,
    prerender?: Render<O[][]>,
}): Scene<State<O>> {
    return {
        state: sets,
        animator,
        layers: [{}, {
            prepare({ canvas, state, frame }) {
                if (prepare) {
                    prepare({ canvas, state, frame });
                }
            },
            render({ canvas, state, frame }) {
                canvas.context.save();
                if (prerender) {
                    prerender({ canvas, state, frame });
                }
                for (let seti = 0; seti < state.length; seti++) {
                    let set = state[seti]!;
                    for (let index = 0; index < set.length; index++) {
                        let object = set[index]!;
                        drawObject({
                            canvas, frame, object, seti, index,
                        });
                    }
                }
                canvas.context.restore();
            }
        }],
    };
}