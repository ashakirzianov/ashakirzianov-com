import {
    SketchCollection,
    arrayAnimator,
    circle, clearFrame, combineScenes, filterUndefined, fromHSLA,
    gravity, hslaRange, modItem, multBox, rainbow, rect, reduceAnimators, scene, square, traceAnimator, vals, vector, velocityStep, zoomToFit
} from '@/sketcher';

export const rythm: SketchCollection = {
    id: 'rythm',
    meta: {
        title: 'Ритм / Rythm',
    },
    sketches: {
        '0': variation0(),
        '1': variation1(),
        '2': variation2(),
        '3': variation3(),
        '4': variation4(),
        '5': variation5(),
        '6': variation6(),
        '7': variation7(),
        '8': variation8(),
        '9': variation9(),
        '10': variation10(),
        '11': variation11(),
        '12': variation12(),
        '13': variation13(),
        '14': variation14(),
        'meh': variationMeh(),
        'white': variationWhite(),
    },
}

export const rytmVariations = [
    variation0(),
    variation1(),
    variation2(),
    variation3(),
    variation4(),
    variation5(),
    variation6(),
    variation7(),
    variation8(),
    variation9(),
    variation10(),
    variation11(),
    variation12(),
    variation13(),
    variation14(),
    variationMeh(),
    variationWhite(),
];

export function currentRythm() {
    return combineScenes(
        variation14(),
    )
}

function form() {
    let n = 7;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 2 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * mass,
                }
            }
        )
    ).flat());
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    {
                        let count = 15;
                        let hue = 20 + idx * 50;
                        let s = 90;
                        hue = 200;
                        let colors = [
                            hslaRange({
                                from: { h: hue, s, l: 40 },
                                to: { h: hue, s, l: 70 },
                                count,
                            })
                        ].flat()
                        let stroke = modItem(colors, idx)
                        circle({
                            lineWidth: .1,
                            stroke,
                            position: object.position,
                            radius: object.radius / Math.sqrt(frame + 3),
                            context: canvas.context,
                        });
                    }
                }
                )
            }
        }]
    });
}

function variation14() {
    let n = 7;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 2 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * mass,
                }
            }
        )
    ).flat());
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    {
                        let count = 15;
                        let hue = 20 + idx * 50;
                        let s = 90;
                        hue = 200;
                        let colors = [
                            hslaRange({
                                from: { h: hue, s, l: 40 },
                                to: { h: hue, s, l: 70 },
                                count,
                            })
                        ].flat()
                        let stroke = modItem(colors, idx)
                        circle({
                            lineWidth: .1,
                            stroke,
                            position: object.position,
                            radius: object.radius / Math.sqrt(frame + 3) * (Math.sin(frame / 20) + 2),
                            context: canvas.context,
                        });
                    }
                }
                )
            }
        }]
    });
}

function variation13() {
    let n = 7;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 2 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * mass,
                    trace: {
                        position: [{ x, y, z: 0 }],
                    },
                }
            }
        )
    ).flat());
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
            arrayAnimator(traceAnimator('position', 1)),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                // clearFrame({ color: '#000', canvas });
                state.forEach((object, idx) => {
                    for (let position of object.trace.position) {
                        let count = 15;
                        let hue = 20 + idx * 50;
                        let s = 90;
                        hue = 200;
                        let colors = [
                            hslaRange({
                                from: { h: hue, s, l: 40 },
                                to: { h: hue, s, l: 70 },
                                count,
                            })
                        ].flat()
                        let stroke = modItem(colors, idx)
                        let f = frame + 5
                        circle({
                            lineWidth: .1,
                            stroke,
                            position: position,
                            // width: object.radius / Math.log(frame),
                            // height: object.radius / Math.log(frame),
                            radius: object.radius * (Math.sin(f / 20) + 2) / Math.sqrt(f),
                            context: canvas.context,
                        });
                    }
                }
                )
            }
        }]
    });
}

function variation12() {
    let n = 13;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 2 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 15;
                    let hue = 20 + idx * 50;
                    let s = 50;
                    hue = 50;
                    let colors = [
                        hslaRange({
                            from: { h: hue, s, l: 50 },
                            to: { h: hue, s, l: 80 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation11() {
    let n = 13;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 5;
                    let hue = 20 + idx * 50;
                    hue = 210;
                    let colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation10() {
    let n = 13;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 5;
                    let hue = 20 + idx * 50;
                    hue = 210;
                    let colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation9() {
    let n = 13;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 5;
                    let hue = 20 + idx * 50;
                    let colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 100 + 2),
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation8() {
    let n = 13;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 5;
                    let hue = 20 + idx * 50;
                    let colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 10),
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation7() {
    let n = 13;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 40 * Math.random(),
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 5;
                    let colors = [
                        hslaRange({
                            from: { h: 90, s: 100, l: 0 },
                            to: { h: 90, s: 100, l: 10 },
                            count,
                        }),
                        hslaRange({
                            from: { h: 90, s: 100, l: 60 },
                            to: { h: 90, s: 100, l: 100 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    rect({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        width: object.radius * Math.random(),
                        height: object.radius * Math.random(),
                        // radius: object.radius * Math.random(),
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation6() {
    let n = 7;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 3;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 10,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let count = 5;
                    let colors = [
                        hslaRange({
                            from: { h: 90, s: 100, l: 0 },
                            to: { h: 90, s: 100, l: 10 },
                            count,
                        }),
                        hslaRange({
                            from: { h: 90, s: 100, l: 60 },
                            to: { h: 90, s: 100, l: 100 },
                            count,
                        })
                    ].flat()
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation5() {
    let n = 7;
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                // if (Math.random() > 0.7) {
                //     return undefined;
                // }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * 0 + 2;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 10,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let colors = hslaRange({
                        from: { h: 360, s: 100, l: 60 },
                        to: { h: 360, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variationMeh() {
    let n = 15;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                // if (Math.random() > 0.7) {
                //     return undefined;
                // }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = ((i) % 2) == 0 ? .2 : .4;
                mass = 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * ((i + j) % 7 + 1) * 4 + Math.random() * 0,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let colors = hslaRange({
                        from: { h: 210, s: 100, l: 60 },
                        to: { h: 210, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation4() {
    let n = 15;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                if (Math.abs(i - j) <= 1) {
                    return undefined;
                }
                // if (Math.random() > 0.7) {
                //     return undefined;
                // }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = ((i) % 2) == 0 ? .2 : .4;
                mass = 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * ((i + j) % 7 + 1) * 20,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let colors = hslaRange({
                        from: { h: 210, s: 100, l: 60 },
                        to: { h: 210, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation3() {
    let n = 10;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                if (Math.abs(i - j) <= -1) {
                    return undefined;
                }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = ((i) % 2) == 0 ? .2 : .4;
                mass = 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 40,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    let colors = hslaRange({
                        from: { h: 260, s: 100, l: 60 },
                        to: { h: 260, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation2() {
    let n = 25;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                if (Math.abs(i - j) <= 3) {
                    return undefined;
                }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = ((i) % 2) == 0 ? .2 : .4;
                mass = 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 40,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 40;
                    let s = 800;
                    let n = 10;
                    let lbase = 60;
                    let lend = 100;
                    let lstep = (lend - lbase) / n;
                    let colors = vals(n).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation1() {
    let n = 25;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                if (Math.abs(i - j) <= 3) {
                    return undefined;
                }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = ((i) % 2) == 0 ? .2 : .4;
                mass = 1;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 40,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 40;
                    let s = 0;
                    let lbase = 60;
                    let lstep = 10;
                    let colors = vals(4).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variation0() {
    let n = 15;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                if (i === j) {
                    return undefined;
                }
                if (Math.random() > 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = (i + j) % 2 == 0 ? 2 : 4;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 4,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame;
                    offset -= frame;
                    let stroke = modItem(palette, offset + 4);
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 40;
                    let s = 0;
                    let lbase = 60;
                    let lstep = 10;
                    let colors = vals(4).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}

function variationWhite() {
    let n = 15;
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2];
    let stepx = 30;
    let stepy = 40;
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined;
                }
                let x = j * stepx - (n - 1) * stepx / 2;
                let y = i * stepy - (n - 1) * stepy / 2;
                let mass = Math.random() * a + b;
                mass = (i + j) % 2 == 0 ? 2 : 4;
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 4,
                }
            }
        )
    ).flat());
    let palette = rainbow({ count: 120 });
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#eee', canvas });
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                });
            },
            render({ canvas, state }) {
                state.forEach((object, idx) => {
                    let colors = [
                        hslaRange({
                            from: { h: 90, s: 0, l: 0 },
                            to: { h: 90, s: 0, l: 40 },
                            count: 5,
                        }),
                    ].flat()
                    let stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
                )
            }
        }]
    });
}