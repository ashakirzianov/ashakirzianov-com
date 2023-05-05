import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals,
    concentringCircles, clearCanvas, scene, enchanceWithSetI, xSets, randomObject, zoomToBoundingBox, clearFrame, hslaRange, drawBlueprint, SketchCollection, getGravity, resultingBody, vector,
} from '@/sketcher'

export const atoms: SketchCollection = {
    id: 'atoms',
    meta: {
        title: 'Атомы / Atoms',
    },
    sketches: [
        moleculesB(),
        moleculesA(),
        moleculesC(),
    ],
}

export function titleAtom() {
    return moleculesA()
}

function moleculesA() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 10
    let massRange = { min: 1, max: 20 }
    let palette = rainbow({ count: 100, s: 100, l: 70 })
    return scene({
        title: 'Molecules A',
        state: enchanceWithSetI(xSets({
            size: 10, velocity: 0,
            creareObjects(box) {
                let batch = Math.floor(randomRange(batchRange))
                return vals(batch).map(() => randomObject({
                    massRange, maxVelocity, box,
                    rToM: 2,
                }))
            },
        })),
        animator: reduceAnimators(
            arrayAnimator(reduceAnimators(
                gravity({ gravity: 0.0015, power: 1 }),
                velocityStep(),
            )),
            function (state) {
                let bodies = state.map(resultingBody)
                for (let fromi = 0; fromi < state.length; fromi++) {
                    for (let toi = fromi + 1; toi < state.length; toi++) {
                        let from = bodies[fromi]!
                        let to = bodies[toi]!
                        let force = getGravity({
                            gravity: 0.00002, power: 1,
                            from, to,
                        })
                        for (let object of state[fromi]!) {
                            object.velocity = vector.add(object.velocity, force)
                        }
                        for (let object of state[toi]!) {
                            object.velocity = vector.sub(object.velocity, force)
                        }
                    }
                }
                return state
            },
        ),
        layers: [{}, {
            // prepare({ canvas }) {
            //     drawBlueprint({
            //         canvas,
            //         lineColor: '#222',
            //     })
            // }
        }, {
            render({ canvas, state, frame }) {
                canvas.context.save()
                clearCanvas(canvas)
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.2
                })
                state.forEach(set => set.forEach(
                    object => {
                        let offset = object.seti * 30 + frame
                        let fills = vals(5).map(
                            (_, i) => modItem(palette, offset - 3 * i)
                        )
                        concentringCircles({
                            context: canvas.context,
                            position: object.position,
                            radius: object.radius,
                            fills,
                        })
                    }
                ))
                canvas.context.restore()
            }
        }],
    })
}

function moleculesC() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 0.1
    let massRange = { min: 10, max: 20 }
    let sets = enchanceWithSetI(xSets({
        size: 10, velocity: 0.1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange))
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }))
        },
    }))
    return scene({
        title: 'Molecules C',
        state: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 1.8 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas }) {
                drawBlueprint({
                    canvas,
                    lineColor: '#222',
                })
            }
        }, {
            render({ canvas, state, frame }) {
                canvas.context.save()
                clearCanvas(canvas)
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.5
                })
                state.forEach(set => set.forEach(
                    object => {
                        let hues = [40, 120, 210, 300]
                        let fills = hslaRange({
                            count: 20,
                            from: {
                                h: modItem(hues, object.seti),
                                s: 100, l: 40,
                            },
                            to: { l: 65 },
                        })
                        concentringCircles({
                            context: canvas.context,
                            position: object.position,
                            radius: object.radius,
                            fills,
                        })
                    },
                ))
                canvas.context.restore()
            }
        }],
    })
}

function moleculesB() {
    let batchRange = { min: 10, max: 20 }
    let maxVelocity = 0.1
    let massRange = { min: 3, max: 20 }
    let palette = rainbow({ count: 100, s: 100, l: 70 })
    let sets = enchanceWithSetI(xSets({
        size: 10, velocity: 0.1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange))
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }))
        },
    }))
    return scene({
        title: 'Molecules B',
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 1.85 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas }) {
                drawBlueprint({
                    canvas,
                    lineColor: '#222',
                })
            }
        }, {
            render({ canvas, state, frame }) {
                canvas.context.save()
                // clearFrame({ canvas, color: 'black' })
                clearCanvas(canvas)
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.5
                })
                state.forEach(set => set.forEach(
                    object => {
                        let offset = object.seti * 30 + frame
                        let fills = vals(5).map(
                            (_, i) => modItem(palette, offset - 3 * i)
                        )
                        concentringCircles({
                            context: canvas.context,
                            position: object.position,
                            radius: object.radius,
                            fills,
                        })
                    }
                ))
                canvas.context.restore()
            }
        }],
    })
}

function bubblesFlatOld() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 0.1
    let massRange = { min: 1, max: 20 }
    let palette = rainbow({ count: 100, s: 100, l: 70 })
    let sets = enchanceWithSetI(xSets({
        size: 10, velocity: 0.1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange))
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }))
        },
    }))
    return scene({
        state: [sets.flat()],
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        layers: [{}, {
            render({ canvas, state, frame }) {
                canvas.context.save()
                clearCanvas(canvas)
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.5
                })
                state.forEach(set => set.forEach(
                    object => {
                        let offset = object.seti * 30 + frame
                        let fills = vals(5).map(
                            (_, i) => modItem(palette, offset - 3 * i)
                        )
                        concentringCircles({
                            context: canvas.context,
                            position: object.position,
                            radius: object.radius,
                            fills,
                        })
                    },
                ))
                canvas.context.restore()
            }
        }],
    })
}