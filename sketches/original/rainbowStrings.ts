import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals,
    scene, enchanceWithSetI, randomObject, xSets, zoomToBoundingBox, pulsating, combineScenes, fromLayers, clearFrame,
} from '@/sketcher'

export function rainbowStrings() {
    let back = pulsating(rainbow({
        count: 200, s: 50, l: 90,
    }))
    return combineScenes(
        fromLayers({
            render({ canvas, frame }) {
                clearFrame({
                    canvas,
                    color: modItem(back, frame),
                })
            },
        }),
        form(),
    )
}

function form() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 1
    let massRange = { min: 0.1, max: 4 }
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
                        let fill = modItem(palette, object.seti * 100 + frame)
                        circle({
                            lineWidth: 0.5,
                            fill,
                            stroke: 'black',
                            center: object.position,
                            radius: object.radius,
                            context: canvas.context,
                        })
                    }
                ))
            }
        }],
    })
}