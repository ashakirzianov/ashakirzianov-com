import {
    velocityStep, gravity, reduceAnimators, arrayAnimator, cubicBox, vals,
    resolvePrimitiveColor, gray, scene, randomObject, zoomToBoundingBox, combineScenes, fromLayers, colorLayer, hslaRange, modItem,
} from '@/sketcher'

export function letters() {
    return combineScenes(
        fromLayers(colorLayer('hsl(40, 100%, 50%)')),
        form('For Whom the Bell Tolls?'),
    )
}

function form(text: string) {
    let maxVelocity = 2
    let massRange = { min: 0.1, max: 2 }
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
        title: 'letters',
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
                let colors = hslaRange({
                    from: { h: 0, s: 0, l: 0 },
                    to: { l: 50 },
                    count: 5,
                })
                state.forEach((set, seti) => set.forEach(
                    (object, index) => {
                        canvas.context.font = '20vh sans-serif'
                        canvas.context.lineWidth = .1
                        let sub = text.at((seti + index) % text.length)!
                        canvas.context.strokeStyle = modItem(colors, index)
                        canvas.context.strokeText(sub, object.position.x, object.position.y)
                    }
                ))
            }
        }],
    })
}