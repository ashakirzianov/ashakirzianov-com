import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals, concentringCircles, scene,
    randomObject, xSets, zoomToBoundingBox, clearFrame, randomBoxes, cubicBox, Color, circle, gray, SketchCollection, drawBlueprint, hslaRange,
} from '@/sketcher'
import { couchAndTable } from './couchAndTable'

export const misc: SketchCollection = {
    id: 'misc',
    meta: {
        title: '...',
    },
    sketches: [
        number34(),
        fourFlowers(),
        letters(),
        couchAndTable(),
    ],
}

export function fourFlowers() {
    const batchRange = { min: 10, max: 10 }
    const maxVelocity = 1
    const massRange = { min: 1, max: 20 }
    const palette = rainbow({ count: 120, s: 100, l: 70 })
    const sets = xSets({
        size: 1, velocity: 1,
        creareObjects(box) {
            const batch = Math.floor(randomRange(batchRange))
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }))
        },
    })
    return scene({
        title: 'Four Flowers',
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas }) {
                clearFrame({ canvas, color: 'black' })
            }
        }, {
            render({ canvas, state, frame }) {
                canvas.context.save()
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.5
                })
                state.forEach((set, seti) => set.forEach(
                    object => {
                        const offset = seti * 30 + frame
                        const fills = vals(5).map(
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

export function letters(text: string = 'For Whom the Bell Tolls?') {
    const maxVelocity = 2
    const massRange = { min: 0.1, max: 2 }
    const boxes = [cubicBox(600)]
    const sets = boxes.map(box => {
        const batch = text.length
        return vals(batch).map(
            () => randomObject({
                massRange, maxVelocity, box, rToM: 4,
            }),
        )
    })
    return scene({
        title: 'Letters',
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas }) {
                drawBlueprint({
                    canvas,
                    background: '#fff',
                    lineColor: '#000',
                })
            },
        }, {
            prepare({ canvas, state }) {
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.2
                })
            },
            render({ canvas, state }) {
                const colors = hslaRange({
                    from: { h: 0, s: 0, l: 0 },
                    to: { l: 50 },
                    count: 5,
                })
                state.forEach((set, seti) => set.forEach(
                    (object, index) => {
                        canvas.context.font = '20vh sans-serif'
                        canvas.context.lineWidth = .1
                        const sub = text.at((seti + index) % text.length)!
                        canvas.context.strokeStyle = modItem(colors, index)
                        canvas.context.strokeText(sub, object.position.x, object.position.y)
                    }
                ))
            }
        }],
    })
}

export function number34(batches?: number) {
    const batchRange = { min: 5, max: 20 }
    const maxVelocity = 5
    const massRange = { min: 0.1, max: 4 }
    const boxes = randomBoxes({
        box: cubicBox(500),
        size: 250,
        count: batches ?? 7,
    })
    const sets = boxes.map(box => {
        const batch = Math.floor(randomRange(batchRange))
        return Array(batch).fill(undefined).map(
            () => randomObject({
                massRange, maxVelocity, box, rToM: 4,
            }),
        )
    })
    const palette: Color[] = [
        '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
    ]
    return scene({
        title: '#34',
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.2, power: 2 }),
            gravity({ gravity: -0.002, power: 5 }),
            velocityStep(),
        )),
        layers: [{}, {
            prepare({ canvas }) {
                clearFrame({ canvas, color: gray(230) })
            }
        }, {
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