import {
    SketchCollection, arrayAnimator, boundingBox, circle, clearFrame, filterUndefined, fromHSLA, gravity, hslaRange,
    inflateBox,
    modItem, multBox,
    rect, reduceAnimators, scene, traceAnimator, vals, vector, velocityStep,
    zoomToFit
} from '@/sketcher'

export function titleRythm() {
    return web()
}

export const rythm: SketchCollection = {
    id: 'rythm',
    meta: {
        title: 'Ритм / Rythm',
    },
    sketches: [
        blackAndWhite(),
        wormholes(),
        rythmRed(),
        water(),
        flower(),
        web(),
        menacing(),
        waffle(),
        whiteAndBlack(),
    ],
}

export const allRythm: SketchCollection = {
    id: 'rythm',
    meta: {
        title: 'Ритм / Rythm',
    },
    sketches: [
        form(),
        whiteAndBlack(),
        variation1(),
        waffle(),
        variation3(),
        water(),
        menacing(),
        variation6(),
        variation7(),
        rainbow(),
        variation9(),
        variation10(),
        variation11(),
        web(),
        variation13(),
        wormholes(),
        rythmRed(),
        blackAndWhite(),
        sunflower(),
    ],
}

function form() {
    const [g, power] = [0.02, 2]
    const stepx = 15
    const stepy = 15
    const positions = circles({
        circles: 20,
        count: 3,
        shift: Math.PI * 0.1,
        step: 1,
    })

    const state = filterUndefined(positions.map((position) => {
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
                const box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state }) {
                k = k * (1 + (Math.random() - .47) * .05)
                // k = 1
                state.forEach((object, idx) => {
                    const s = 80
                    const count = 10
                    const colors = [
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

                    const stroke = modItem(colors, idx)
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

function _flower2() {
    const [g, power] = [0.02, 2]
    const stepx = 15
    const stepy = 15
    const positions = circles({
        circles: 20,
        count: 3,
        shift: Math.PI * 0.1,
        step: 1,
    })

    const state = filterUndefined(positions.map((position) => {
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
                const box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state }) {
                k = k * (1 + (Math.random() - .35) * 0.01)
                state.forEach((object, idx) => {
                    const s = 80
                    const count = 10
                    const colors = [
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

                    const stroke = modItem(colors, idx)
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

function flower() {
    const stepx = 15
    const stepy = 15

    let k = 1
    return scene({
        title: 'Flower',
        state: circles({
            circles: 8,
            count: 5,
            shift: Math.PI * 0.1,
            step: 1,
        }).map((position) => {
            return {
                position: {
                    x: position.x * stepx,
                    y: position.y * stepy,
                    z: position.z,
                },
                velocity: vector.value(0),
                mass: 1,
                radius: 20,
            }
        }),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas, state }) {
                clearFrame({
                    color: '#000', canvas
                })
                const box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: inflateBox(box, 0.3)
                })
            },
            render({ canvas, state, frame }) {
                k = k * (1 + (Math.random() - .3) * 0.01)
                // k *= 1.001
                const count = 10
                const colors = [
                    // ...hslaRange({
                    //     from: { h: 40, s: 80, l: 30 },
                    //     to: { l: 60 },
                    //     count,
                    // }),
                    ...hslaRange({
                        from: { h: 40, s: 0, l: 0 },
                        to: { l: 15 },
                        count,
                    }),
                    ...hslaRange({
                        from: { h: 0, s: 100, l: 20 },
                        to: { l: 30 },
                        count,
                    }),
                    ...hslaRange({
                        from: { h: 0, s: 100, l: 60 },
                        to: { l: 70 },
                        count,
                    }),
                ]
                let mult = 1 + (1 + Math.sin(-Math.PI / 2 + Math.sqrt(frame / 300))) * 2
                mult = 1 + (1 + Math.sin(-Math.PI / 2 + frame / 300)) * 2
                // mult *= k
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius * mult,
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function sunflower() {
    const stepx = 15
    const stepy = 15

    let k = 1
    return scene({
        title: 'Sunlower',
        state: circles({
            circles: 10,
            count: 5,
            shift: Math.PI * 0.1,
            step: 1,
        }).map((position) => {
            return {
                position: {
                    x: position.x * stepx,
                    y: position.y * stepy,
                    z: position.z,
                },
                velocity: vector.value(0),
                mass: 1,
                radius: 20,
            }
        }),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas, state }) {
                clearFrame({
                    color: '#000', canvas
                })
                const box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state }) {
                k = k * (1 + (Math.random() - .3) * 0.01)
                const s = 100
                const count = 10
                const colors = [
                    ...hslaRange({
                        from: { h: 49, s, l: 30 },
                        to: { h: 49, s, l: 90 },
                        count,
                    }),
                    ...hslaRange({
                        from: { h: 214, s, l: 30 },
                        to: { h: 214, s, l: 90 },
                        count,
                    }),
                ]
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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

function _variation15() {
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = fromMap([
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
    return scene({
        state,
        animator: (reduceAnimators(
            gravity({ gravity: g, power }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas }) {
                clearFrame({ color: '#000', canvas })
                const box = boundingBox(state.map(o => o.position))
                zoomToFit({
                    canvas,
                    box: multBox(box, 1)
                })
            },
            render({ canvas, state }) {
                state.forEach((object, idx) => {
                    const h = 0
                    const s = 800
                    const n = 10
                    const lbase = 60
                    const lend = 100
                    const lstep = (lend - lbase) / n
                    const colors = vals(n).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    const stroke = modItem(colors, idx)
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

function wormholes() {
    const n = 7
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Wormholes',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = Math.random() * 2 + 1
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: 20 * mass,
                        k: 1,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
            arrayAnimator(o => ({
                ...o,
                k: o.k * (1 + (0.47 - Math.random()) / 20),
            }))
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
                function dim(min: number) {
                    return min + (1 - min) / (1 + frame / 400)
                }
                const count = 15
                const a = dim(0.25)
                const colors = [
                    ...hslaRange({
                        from: { h: 200, s: 90, l: 40, a },
                        to: { l: 70, a },
                        count,
                    })
                ]
                state.forEach((object, idx) => {
                    {
                        const stroke = modItem(colors, idx)
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
    const n = 7
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 2 + 1
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
                    for (const position of object.trace.position) {
                        const count = 15
                        let hue = 20 + idx * 50
                        const s = 90
                        hue = 200
                        const colors = [
                            hslaRange({
                                from: { h: hue, s, l: 40 },
                                to: { h: hue, s, l: 70 },
                                count,
                            })
                        ].flat()
                        const stroke = modItem(colors, idx)
                        const f = frame + 5
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

function web() {
    const n = 13
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Web',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 0) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = Math.random() * 2 + 1
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: 20 * Math.random() * mass,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
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
                const a = 1 / (frame / 100 + 1)
                const colors = [
                    ...hslaRange({
                        from: { h: 40, s: 80, l: 50, a },
                        to: { l: 80, a },
                        count: 15,
                    })
                ]
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: object.radius / Math.log10(frame / 10 + 1),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function _variation12() {
    const n = 13
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 2 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass,
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
                    const count = 15
                    let hue = 20 + idx * 50
                    const s = 50
                    hue = 50
                    const colors = [
                        hslaRange({
                            from: { h: hue, s, l: 50 },
                            to: { h: hue, s, l: 80 },
                            count,
                        })
                    ].flat()
                    const stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
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
    const n = 13
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
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
                    const count = 5
                    let hue = 20 + idx * 50
                    hue = 210
                    const colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    const stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
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
    const n = 13
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
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
                    const count = 5
                    let hue = 20 + idx * 50
                    hue = 210
                    const colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    const stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
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
    const n = 13
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 20 * Math.random() * mass * 0 + 10,
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
                    const count = 5
                    const hue = 20 + idx * 50
                    const colors = [
                        hslaRange({
                            from: { h: hue, s: 100, l: 60 },
                            to: { h: hue, s: 100, l: 70 },
                            count,
                        })
                    ].flat()
                    const stroke = modItem(colors, idx)
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

function rainbow() {
    const n = 13
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'rainbow',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    if (Math.random() > 1) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = Math.random() * 0 + 1
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: 10,
                        anchor: {
                            position: vector.value(0),
                            mass: 100,
                        },
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            // arrayAnimator(pullToAnchor({ power: 2, gravity: 0.2 })),
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
                    const count = 5
                    const hue = 20 + idx * 50
                    const a = .8
                    const colors = [
                        ...hslaRange({
                            from: { h: hue, s: 100, l: 40, a },
                            to: { l: 70 },
                            count,
                        })
                    ]
                    const stroke = modItem(colors, idx)
                    circle({
                        lineWidth: .1,
                        stroke,
                        center: object.position,
                        radius: 2 * object.radius / Math.sqrt((frame + 20) / 100),
                        context: canvas.context,
                    })
                }
                )
            }
        }]
    })
}

function variation7() {
    const n = 13
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 0 + 1
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 40 * Math.random(),
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
            render({ canvas, state }) {
                state.forEach((object, idx) => {
                    const count = 5
                    const colors = [
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
                    const stroke = modItem(colors, idx)
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
    const n = 7
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
                const mass = Math.random() * 0 + 3
                return {
                    position: { x, y, z: 0 },
                    velocity: vector.value(0),
                    mass,
                    radius: 10,
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
            render({ canvas, state }) {
                state.forEach((object, idx) => {
                    const count = 5
                    const colors = [
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
                    const stroke = modItem(colors, idx)
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

function menacing() {
    const n = 7
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Menacing Rythm',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = 2
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: 10,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
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
            render({ canvas, state }) {
                const colors = hslaRange({
                    from: { h: 0, s: 100, l: 60 },
                    to: { l: 100 },
                    count: 10,
                })
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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

function rythmRed() {
    const n = 15
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Rythm Red',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = 1
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: mass * ((i + j) % 7 + 1) * 4 + Math.random() * 0,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
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
            render({ canvas, state }) {
                const colors = hslaRange({
                    from: { h: 0, s: 100, l: 60 },
                    to: { l: 100 },
                    count: 10,
                })
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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

function water() {
    const n = 15
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Water',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    if (Math.abs(i - j) <= 1) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass: 1,
                        radius: ((i + j) % 7 + 1) * 20,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
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
            render({ canvas, state }) {
                const colors = hslaRange({
                    from: { h: 210, s: 100, l: 60 },
                    to: { l: 100 },
                    count: 10,
                })
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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
    const n = 10
    const [a, b] = [0, 2]
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
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
            render({ canvas, state }) {
                state.forEach((object, idx) => {
                    const colors = hslaRange({
                        from: { h: 260, s: 100, l: 60 },
                        to: { h: 260, s: 100, l: 100 },
                        count: 10,
                    })
                    const stroke = modItem(colors, idx)
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

function waffle() {
    const n = 25
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Waffle',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    if (Math.abs(i - (n - 1 - j)) <= 3) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = 1
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        radius: 40,
                        mass,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        layers: [{}, {}, {
            prepare({ canvas, state }) {
                clearFrame({ color: '#000', canvas })
                const box = boundingBox(state.map(object => object.position))
                zoomToFit({
                    canvas,
                    box: inflateBox(box, 0.2)
                })
            },
            render({ canvas, state }) {
                const colors = hslaRange({
                    from: { h: 40, s: 100, l: 60 },
                    to: { l: 100 },
                    count: 10,
                })
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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
    const n = 25
    const [a, b] = [0, 2]
    const [g, power] = [0.02, 2]
    const stepx = 30
    const stepy = 40
    const state = filterUndefined(vals(n).map(
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
                const x = j * stepx - (n - 1) * stepx / 2
                const y = i * stepy - (n - 1) * stepy / 2
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
            render({ canvas, state }) {
                state.forEach((object, idx) => {
                    const h = 40
                    const s = 0
                    const lbase = 60
                    const lstep = 10
                    const colors = vals(4).map(
                        (_, idx) => fromHSLA({ h, s, l: lbase + lstep * idx })
                    )
                    const stroke = modItem(colors, idx)
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

function whiteAndBlack() {
    const n = 15
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'White And Black',
        state: filterUndefined(vals(n).map(
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
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = 2
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: mass * 4,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
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
            render({ canvas, state }) {
                const colors = [
                    ...hslaRange({
                        from: { h: 40, s: 0, l: 30 },
                        to: { l: 100 },
                        count: 5,
                    }),
                ]
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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

function blackAndWhite() {
    const n = 15
    const stepx = 30
    const stepy = 40
    return scene({
        title: 'Black And White',
        state: filterUndefined(vals(n).map(
            (_, i) => vals(n).map(
                (_, j) => {
                    if ((i + j) % 2 == 1) {
                        return undefined
                    }
                    const x = j * stepx - (n - 1) * stepx / 2
                    const y = i * stepy - (n - 1) * stepy / 2
                    const mass = 2
                    return {
                        position: { x, y, z: 0 },
                        velocity: vector.value(0),
                        mass,
                        radius: mass * 4,
                    }
                }
            )
        ).flat()),
        animator: (reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
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
                const colors = [
                    ...hslaRange({
                        from: { h: 90, s: 0, l: 0 },
                        to: { h: 90, s: 0, l: 40 },
                        count: 5,
                    }),
                ]
                state.forEach((object, idx) => {
                    const stroke = modItem(colors, idx)
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
            const result = []
            for (const ch of str) {
                result.push(ch === char)
            }
            return result
        }
    )
}

function makePositions(map: boolean[][]) {
    const positions = []
    for (let ridx = 0; ridx < map.length; ridx++) {
        const row = map[ridx]!
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
    return positions
}

function circles({ circles, count, shift, step }: {
    circles: number,
    count: number,
    shift: number,
    step: number,
}) {
    const result = []
    let start = 0
    for (let i = 0; i < circles; i++) {
        const ps = circlePositions(count, start).map(
            p => vector.mults(p, step * (i + 1))
        )
        result.push(...ps)
        start += shift
    }
    return result
}

function circlePositions(count: number, start: number) {
    const positions = []
    for (let i = 0; i < count; i++) {
        const angle = Math.PI * 2 / count * i + start
        const x = Math.cos(angle)
        const y = Math.sin(angle)
        const z = 0
        positions.push({ x, y, z })
    }
    return positions
}