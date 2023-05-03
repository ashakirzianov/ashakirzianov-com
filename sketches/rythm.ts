import {
    SketchCollection, arrayAnimator, boundingBox, circle, clearFrame,
    filterUndefined, fromHSLA, gravity, hslaRange,
    modItem, multBox, rainbow,
    rect, reduceAnimators, scene, square, traceAnimator, vals, vector, velocityStep,
    zoomToFit
} from '@/sketcher'

export function currentRythm() {
    return variation14()
}

export const rythm: SketchCollection = {
    id: 'rythm',
    meta: {
        title: 'Ритм / Rythm',
    },
    sketches: {
        'current': form(),
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
        'sunflower': sunflower(),
    },
}

function form() {
    let [g, power] = [0.02, 2]
    let stepx = 15
    let stepy = 15
    let positions = circles({
        circles: 20,
        count: 3,
        shift: Math.PI * 0.1,
        step: 1,
    })

    let state = filterUndefined(positions.map((position, idx) => {
        if (Math.random() > 0.9) {
            return undefined
        }
        return {
            position: {
                x: position.x * stepx,
                y: position.y * stepy,
                z: position.z,
            },
            velocity: vector.value(0),
            mass: 1,
            radius: 40,
            kk: 1,
        }
    }))
    let k = 1
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
            arrayAnimator(o => ({
                ...o,
                kk: o.kk * (1 + (Math.random() - .47) * 0.05),
            }))
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                let box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state, frame }) {
                k = k * (1 + (Math.random() - .47) * .05)
                // k = 1
                state.forEach((object, idx) => {
                    let h = 60
                    let s = 80
                    let count = 10
                    let colors = [
                        ...hslaRange({
                            from: { h: 60, s, l: 30 },
                            to: { h: 60, s, l: 70 },
                            count,
                        }),
                        ...hslaRange({
                            from: { h: 210, s, l: 30 },
                            to: { h: 210, s, l: 70 },
                            count,
                        }),
                    ].flat()

                    let stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius * object.kk,
                        context: canvas.context,
                        // rotation: (idx + frame / 20) * 0.1,
                        // rotation: Math.PI / 4 + frame / 120,
                    })
                }
                )
            }
        }]
    })
}

function flower() {
    let [g, power] = [0.02, 2]
    let stepx = 15
    let stepy = 15
    let positions = circles({
        circles: 20,
        count: 3,
        shift: Math.PI * 0.1,
        step: 1,
    })

    let state = filterUndefined(positions.map((position, idx) => {
        if (Math.random() > 0.9) {
            return undefined
        }
        return {
            position: {
                x: position.x * stepx,
                y: position.y * stepy,
                z: position.z,
            },
            velocity: vector.value(0),
            mass: 1,
            radius: 40,
        }
    }))
    let k = 1
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                let box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state, frame }) {
                k = k * (1 + (Math.random() - .35) * 0.01)
                state.forEach((object, idx) => {
                    let h = 60
                    let s = 80
                    let count = 10
                    let colors = [
                        ...hslaRange({
                            from: { h: 60, s, l: 50 },
                            to: { h: 60, s, l: 70 },
                            count,
                        }),
                        ...hslaRange({
                            from: { h: 0, s, l: 50 },
                            to: { h: 0, s, l: 70 },
                            count,
                        }),
                        ...hslaRange({
                            from: { h: 110, s, l: 50 },
                            to: { h: 110, s, l: 70 },
                            count,
                        }),
                    ].flat()

                    let stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius * k,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function sunflower() {
    let [g, power] = [0.02, 2]
    let stepx = 15
    let stepy = 15
    let positions = circles({
        circles: 10,
        count: 5,
        shift: Math.PI * 0.1,
        step: 1,
    })

    let state = positions.map((position, idx) => {
        return {
            position: {
                x: position.x * stepx,
                y: position.y * stepy,
                z: position.z,
            },
            velocity: vector.value(0),
            mass: 1,
            // radius: 10 + idx * .2,
            radius: 20,
        }
    })
    let k = 1
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                let box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state, frame }) {
                k = k * (1 + (Math.random() - .3) * 0.01)
                state.forEach((object, idx) => {
                    let h = 60
                    let s = 80
                    let count = 10
                    let colors = [
                        // ...hslaRange({
                        //     from: { h, s, l: 20 },
                        //     to: { h, s, l: 40 },
                        //     count,
                        // }),
                        ...hslaRange({
                            from: { h, s, l: 30 },
                            to: { h, s, l: 90 },
                            count,
                        }),
                        // ...hslaRange({
                        //     from: { h: 110, s: 0, l: 30 },
                        //     to: { h: 110, s: 0, l: 90 },
                        //     count,
                        // }),
                        ...hslaRange({
                            from: { h: 210, s, l: 30 },
                            to: { h: 210, s, l: 90 },
                            count,
                        }),
                    ].flat()

                    let stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius * k,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation15() {
    let n = 100
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = fromMap([
        '    ....    ',
        '     ..     ',
        '     ..     ',
        '     ..     ',
        '.    ..    .',
        '............',
        '............',
        '.    ..    .',
        '     ..     ',
        '     ..     ',
        '     ..     ',
        '     ..     ',
        '     ..     ',
        '     ..     ',
        '     ..     ',
        '    ....    ',
    ]).map(position => {
        return {
            position: {
                x: position.x * stepx,
                y: position.y * stepy,
                z: position.z,
            },
            velocity: vector.value(0),
            mass: 2,
            radius: 20, // 20 * Math.random(),
        }
    })
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                let box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 0
                    let s = 800
                    let n = 10
                    let lbase = 60
                    let lend = 100
                    let lstep = (lend - lbase) / n
                    let colors = vals(n).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation14() {
    let n = 7
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 2 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * mass,
                }
            }
        )
    ).flat())
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    {
                        let count = 15
                        let hue = 20 + idx * 50
                        let s = 90
                        hue = 200
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
                            center: object.position,
                            radius: object.radius / Math.sqrt(frame + 3) * (Math.sin(frame / 20) + 2),
                            context: canvas.context,
                        })
                    }
                }
                )
            }
        }]
    })
}

function variation13() {
    let n = 7
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 2 + 1
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
    ).flat())
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
            arrayAnimator(traceAnimator('position', 1)),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                // clearFrame({ color: '#000', canvas });
                state.forEach((object, idx) => {
                    for (let position of object.trace.position) {
                        let count = 15
                        let hue = 20 + idx * 50
                        let s = 90
                        hue = 200
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
                            center: position,
                            // width: object.radius / Math.log(frame),
                            // height: object.radius / Math.log(frame),
                            radius: object.radius / Math.sqrt(f),
                            context: canvas.context,
                        })
                    }
                }
                )
            }
        }]
    })
}

function variation12() {
    let n = 13
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 2 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 15
                    let hue = 20 + idx * 50
                    let s = 50
                    hue = 50
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
                        center: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation11() {
    let n = 13
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 5
                    let hue = 20 + idx * 50
                    hue = 210
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
                        center: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation10() {
    let n = 13
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 5
                    let hue = 20 + idx * 50
                    hue = 210
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
                        center: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation9() {
    let n = 13
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 5
                    let hue = 20 + idx * 50
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
                        center: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 100 + 2),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation8() {
    let n = 13
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 5
                    let hue = 20 + idx * 50
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
                        center: object.position,
                        // width: object.radius / Math.log(frame),
                        // height: object.radius / Math.log(frame),
                        radius: object.radius / Math.log10(frame / 10 + 10),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation7() {
    let n = 13
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 40 * Math.random(),
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 5
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
                        center: object.position,
                        width: object.radius * Math.random(),
                        height: object.radius * Math.random(),
                        // radius: object.radius * Math.random(),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation6() {
    let n = 7
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 3
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 10,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let count = 5
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
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation5() {
    let n = 7
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                // if (Math.random() > 0.7) {
                //     return undefined;
                // }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * 0 + 2
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 10,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let colors = hslaRange({
                        from: { h: 360, s: 100, l: 60 },
                        to: { h: 360, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variationMeh() {
    let n = 15
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                // if (Math.abs(i - j) <= 1) {
                //     return undefined;
                // }
                // if (Math.random() > 0.7) {
                //     return undefined;
                // }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = ((i) % 2) == 0 ? .2 : .4
                mass = 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * ((i + j) % 7 + 1) * 4 + Math.random() * 0,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let colors = hslaRange({
                        from: { h: 210, s: 100, l: 60 },
                        to: { h: 210, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation4() {
    let n = 15
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                if (Math.abs(i - j) <= 1) {
                    return undefined
                }
                // if (Math.random() > 0.7) {
                //     return undefined;
                // }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = ((i) % 2) == 0 ? .2 : .4
                mass = 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * ((i + j) % 7 + 1) * 20,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let colors = hslaRange({
                        from: { h: 210, s: 100, l: 60 },
                        to: { h: 210, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation3() {
    let n = 10
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                if (Math.abs(i - j) <= -1) {
                    return undefined
                }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = ((i) % 2) == 0 ? .2 : .4
                mass = 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 40,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    let colors = hslaRange({
                        from: { h: 260, s: 100, l: 60 },
                        to: { h: 260, s: 100, l: 100 },
                        count: 10,
                    })
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation2() {
    let n = 25
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                if (Math.abs(i - j) <= 3) {
                    return undefined
                }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = ((i) % 2) == 0 ? .2 : .4
                mass = 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 40,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 40
                    let s = 800
                    let n = 10
                    let lbase = 60
                    let lend = 100
                    let lstep = (lend - lbase) / n
                    let colors = vals(n).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation1() {
    let n = 25
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                if (Math.abs(i - j) <= 3) {
                    return undefined
                }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = ((i) % 2) == 0 ? .2 : .4
                mass = 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 40,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 40
                    let s = 0
                    let lbase = 60
                    let lstep = 10
                    let colors = vals(4).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation0() {
    let n = 15
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                if (i === j) {
                    return undefined
                }
                if (Math.random() > 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = (i + j) % 2 == 0 ? 2 : 4
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 4,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
            },
            render({ canvas, state, frame }) {
                state.forEach((object, idx) => {
                    let offset = idx * 100 + frame
                    offset -= frame
                    let stroke = modItem(palette, offset + 4)
                    // stroke = modItem(['black', '#333', '#666'], idx)
                    let h = 40
                    let s = 0
                    let lbase = 60
                    let lstep = 10
                    let colors = vals(4).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variationWhite() {
    let n = 15
    let [a, b] = [0, 2]
    let [g, power] = [0.02, 2]
    let stepx = 30
    let stepy = 40
    let state = filterUndefined(vals(n).map(
        (_, i) => vals(n).map(
            (_, j) => {
                if ((i + j) % 2 == 1) {
                    return undefined
                }
                let x = j * stepx - (n - 1) * stepx / 2
                let y = i * stepy - (n - 1) * stepy / 2
                let mass = Math.random() * a + b
                mass = (i + j) % 2 == 0 ? 2 : 4
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: mass * 4,
                }
            }
        )
    ).flat())
    let palette = rainbow({ count: 120 })
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#eee', canvas })
                zoomToFit({
                    canvas,
                    box: multBox({
                        start: vector.fromTuple([-n * stepx, -n * stepy, 0]),
                        end: vector.fromTuple([n * stepx, n * stepy, 0]),
                    }, 0.5)
                })
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
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function fromMap(stringMap: string[]) {
    return makePositions(makeBoolMap(stringMap, '.'))
}

function makeBoolMap(stringMap: string[], char: string) {
    return stringMap.map(
        str => {
            let result = []
            for (let ch of str) {
                result.push(ch === char);
            }
            return result;
        }
    )
}

function makePositions(map: boolean[][]) {
    let positions = []
    for (let ridx = 0; ridx < map.length; ridx++) {
        let row = map[ridx]!
        for (let cidx = 0; cidx < row.length; cidx++) {
            if (row[cidx]) {
                positions.push({
                    x: cidx,
                    y: ridx,
                    z: 0,
                })
            }
        }
    }
    return positions;
}

function circles({ circles, count, shift, step }: {
    circles: number,
    count: number,
    shift: number,
    step: number,
}) {
    let result = []
    let start = 0
    for (let i = 0; i < circles; i++) {
        let ps = circlePositions(count, start).map(
            p => vector.mults(p, step * (i + 1))
        )
        result.push(...ps)
        start += shift
    }
    return result
}

function circlePositions(count: number, start: number) {
    let positions = []
    for (let i = 0; i < count; i++) {
        let angle = Math.PI * 2 / count * i + start
        let x = Math.cos(angle)
        let y = Math.sin(angle)
        let z = 0
        positions.push({ x, y, z })
    }
    return positions
}