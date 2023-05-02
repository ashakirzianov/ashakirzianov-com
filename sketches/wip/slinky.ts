import {
    arrayAnimator, circle, clearFrame, combineScenes, enchanceWithSetI, fromLayers, gravity, modItem, pulsating, rainbow,
    randomObject, randomRange, reduceAnimators, scene, vals, velocityStep,
    xSets, zoomToBoundingBox
} from '@/sketcher'

export function slinky() {
    let back = pulsating(rainbow({
        count: 200, s: 50, l: 90,
    }))
    return combineScenes(
        fromLayers({
            prepare({ canvas, frame }) {
                clearFrame({
                    canvas,
                    color: 'white',
                })
            },
        }),
        form(),
    )
}

function form() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 1
    let massRange = { min: 1, max: 20 }
    let sets = enchanceWithSetI(xSets({
        size: 1, velocity: 1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange))
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }))
        }
    }))
    let palette = rainbow({ count: 120 })
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
                })
            },
            render({ canvas, state, frame }) {
                state.forEach(set => set.forEach(
                    object => {
                        let offset = object.seti * 100 + frame
                        let stroke = modItem(palette, offset + 4)
                        circle({
                            lineWidth: 3,
                            stroke,
                            position: object.position,
                            radius: object.radius,
                            context: canvas.context,
                        })
                    }
                ))
            }
        }]
    })
}