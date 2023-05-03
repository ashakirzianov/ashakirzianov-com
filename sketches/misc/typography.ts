import {
    velocityStep, gravity, reduceAnimators, arrayAnimator, cubicBox, vals,
    resolvePrimitiveColor, gray, scene, randomObject, zoomToBoundingBox, combineScenes, fromLayers, colorLayer,
} from '@/sketcher'

export function typography() {
    return combineScenes(
        fromLayers(colorLayer(gray(230))),
        form('Typography?'),
    )
}

function form(text: string) {
    let maxVelocity = 5
    let massRange = { min: 0.1, max: 4 }
    let boxes = [cubicBox(600)]
    let sets = boxes.map(box => {
        let batch = text.length
        return vals(batch).map(
            () => randomObject({
                massRange, maxVelocity, box, rToM: 4,
            }),
        )
    })
    return scene({
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas, state }) {
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.2
                })
            },
            render({ canvas, state }) {
                state.forEach((set, seti) => set.forEach(
                    (object, index) => {
                        canvas.context.font = '20vh sans-serif'
                        canvas.context.lineWidth = .1
                        let sub = text.at((seti + index) % text.length)!
                        canvas.context.strokeStyle = 'black'
                        canvas.context.strokeText(sub, object.position.x, object.position.y)
                        canvas.context.fillStyle = resolvePrimitiveColor(gray(230))
                        // canvas.context.fillText(sub, object.position.x, object.position.y);
                    }
                ))
            }
        }],
    })
}
