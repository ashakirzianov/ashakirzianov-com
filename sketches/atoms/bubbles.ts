import {
    velocityStep, gravity, reduceAnimators, arrayAnimator,
    randomRange, rainbow, modItem, vals,
    concentringCircles, clearCanvas, scene, enchanceWithSetI, xSets, randomObject, zoomToBoundingBox, combineScenes, fromLayers, colorLayer,
} from '@/sketcher';

export function bubbles() {
    return combineScenes(
        fromLayers(colorLayer('black')),
        form(),
    );
}

function form() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 0.1;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 100, s: 100, l: 70 });
    let sets = enchanceWithSetI(xSets({
        size: 10, velocity: 0.1,
        creareObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(() => randomObject({
                massRange, maxVelocity, box,
                rToM: 2,
            }));
        },
    }));
    return scene({
        state: sets,
        animator: arrayAnimator(reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            velocityStep(),
        )),
        layers: [{}, {
            render({ canvas, state, frame }) {
                canvas.context.save();
                clearCanvas(canvas);
                zoomToBoundingBox({
                    canvas, objects: state.flat(), scale: 1.5
                });
                state.forEach(set => set.forEach(
                    object => {
                        let offset = object.seti * 30 + frame;
                        let fills = vals(5).map(
                            (_, i) => modItem(palette, offset - 3 * i)
                        );
                        concentringCircles({
                            context: canvas.context,
                            position: object.position,
                            radius: object.radius,
                            fills,
                        });
                    }
                ));
                canvas.context.restore();
            }
        }],
    });
}