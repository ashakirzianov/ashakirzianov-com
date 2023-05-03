import {
    clearFrame, renderMask, renderPositionedElement, layoutOnCanvas,
    colorLayer, combineScenes, arrayAnimator, clearCanvas, concentringCircles,
    enchanceWithSetI, fromLayers, getGravity, gravity, modItem, rainbow,
    randomObject, randomRange, reduceAnimators, resultingBody, scene, vals,
    vector, velocityStep, xSets, zoomToBoundingBox,
} from '@/sketcher'

export function styleIsTheAnswer() {
    return combineScenes(
        fromLayers(colorLayer('black')),
        form(),
        fromLayers({
            prepare({ canvas }) {
                let font = {
                    fontSize: 15,
                    smallCaps: true,
                    bold: true,
                    color: 'white',
                }
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
                })

                clearFrame({ canvas, color: 'black' })
                renderMask(canvas.context, context => {
                    for (let positioned of layout) {
                        renderPositionedElement({ canvas, positioned })
                    }
                })
            },
        }),
    )
}

function form() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 10
    let massRange = { min: 1, max: 20 }
    let palette = rainbow({ count: 100, s: 100, l: 70 })
    return scene({
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