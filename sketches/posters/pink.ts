import {
    renderMask, renderPositionedElement,
    layoutOnCanvas, colorLayer, velocityStep, gravity, circle,
    reduceAnimators, arrayAnimator, randomRange, rainbow, modItem, vals,
    combineScenes, fromLayers, clearFrame, scene, enchanceWithSetI, xSets,
    randomObject, zoomToBoundingBox,
} from '@/sketcher'

export function pink() {
    return combineScenes(
        fromLayers(colorLayer('white')),
        form(),
        fromLayers({
            prepare({ canvas }) {
                let font = {
                    fontSize: 20,
                    bold: true,
                    color: 'white',
                }
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'end',
                    crossJustify: 'stretch',
                    padding: 2,
                    content: [
                        {

                            justify: 'start',
                            padding: {
                                top: 0,
                                bottom: 20,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Gentlest of all colors',
                                fontSize: 1,
                                color: 'black',
                                rotation: -Math.PI / 2
                            }],
                        },
                        {
                            justify: 'center',
                            crossJustify: 'end',
                            padding: {
                                bottom: 20,
                                top: 0,
                            },
                            content: [{
                                content: [{
                                    id: 'large-text',
                                    text: 'Pink',
                                    ...font,
                                }]
                            }],
                        },
                    ],
                })

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!
                let large = layout.find(p => p.element.id === 'large-text')!
                let side = large.dimensions.width
                let x = large.position.left
                let y = small.position.top + small.dimensions.height - side

                clearFrame({ canvas, color: 'pink' })
                renderMask(canvas.context, context => {
                    context.fillRect(x, y, side, side)
                })

                for (let positioned of layout) {
                    renderPositionedElement({ canvas, positioned })
                }
            },
        }),
    )
}

function form() {
    let batchRange = { min: 10, max: 10 }
    let maxVelocity = 1
    let massRange = { min: 1, max: 20 }
    let palette = rainbow({ count: 120, s: 80, l: 70 })
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
                        let n = 5
                        for (let i = 0; i < n; i++) {
                            let offset = frame + object.seti * 100 + i * 20
                            let fill = modItem(palette, offset)
                            let next = modItem(palette, offset + 10)
                            circle({
                                lineWidth: 5,
                                fill: fill,
                                stroke: next,
                                center: object.position,
                                radius: object.radius * i,
                                context: canvas.context,
                            })
                        }
                    }
                ))
            }
        }],
    })
}
