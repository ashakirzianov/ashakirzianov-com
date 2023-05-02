import {
    arrayAnimator, circle, colorLayer, combineScenes, enchanceWithSetI, fromLayers, gravity, modItem, rainbow, randomObject, randomRange,
    reduceAnimators, scene, vals, velocityStep, xSets, zoomToBoundingBox
} from "@/sketcher"

export function strokedSlinky() {
    return combineScenes(
        fromLayers(colorLayer('black')),
        form(),
    )
}

function form() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 1
    let massRange = { min: 1, max: 20 }
    let palette = rainbow({ count: 120 })
    let sets = enchanceWithSetI(xSets({
        size: 1, velocity: 1,
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
                        let fill = modItem(palette, 100 * object.seti + frame + 20)
                        circle({
                            lineWidth: 0.2,
                            fill: fill,
                            stroke: 'black',
                            position: object.position,
                            radius: object.radius * 3,
                            context: canvas.context,
                        })
                    }
                ))
            }
        }],
    })
}