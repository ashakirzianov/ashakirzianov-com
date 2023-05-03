import {
    velocityStep, gravity, circle, reduceAnimators, arrayAnimator,
    randomRange, Color, cubicBox, modItem, randomBoxes, scene,
    colorLayer, combineScenes, fromLayers, gray, randomObject, zoomToBoundingBox,
} from '@/sketcher'

export function number34() {
    return combineScenes(
        fromLayers(colorLayer(gray(230))),
        form(),
    )
}

function form(batches?: number) {
    let batchRange = { min: 5, max: 20 }
    let maxVelocity = 5
    let massRange = { min: 0.1, max: 4 }
    let boxes = randomBoxes({
        box: cubicBox(500),
        size: 250,
        count: batches ?? 7,
    })
    let sets = boxes.map(box => {
        let batch = Math.floor(randomRange(batchRange))
        return Array(batch).fill(undefined).map(
            () => randomObject({
                massRange, maxVelocity, box, rToM: 4,
            }),
        )
    })
    let palette: Color[] = [
        '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
    ]
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
                    canvas,
                    objects: state.flat(),
                    scale: 1.2,
                })
            },
            render({ canvas, state }) {
                state.forEach((set, seti) => set.forEach(
                    object => circle({
                        lineWidth: 0.5,
                        fill: modItem(palette, seti),
                        stroke: 'black',
                        center: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    })
                ))
            },
        }],
    })
}