import {
    arrayAnimator, clearCanvas, concentringCircles, getGravity, gravity, modItem, rainbow, randomRange, reduceAnimators, resultingBody, vals, vector, velocityStep,
} from "@/sketcher";
import {
    enchanceWithSetI, randomObject, setsScene, xSets, zoomToBoundingBox,
} from "./utils";

export function molecules() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 10;
    let massRange = { min: 1, max: 20 };
    let palette = rainbow({ count: 100, s: 100, l: 70 });
    return setsScene({
        sets: enchanceWithSetI(xSets({
            size: 10, velocity: 0,
            creareObjects(box) {
                let batch = Math.floor(randomRange(batchRange));
                return vals(batch).map(() => randomObject({
                    massRange, maxVelocity, box,
                    rToM: 2,
                }));
            },
        })),
        animator: reduceAnimators(
            arrayAnimator(reduceAnimators(
                gravity({ gravity: 0.0015, power: 1 }),
                velocityStep(),
            )),
            function (state) {
                let bodies = state.map(resultingBody);
                for (let fromi = 0; fromi < state.length; fromi++) {
                    for (let toi = fromi + 1; toi < state.length; toi++) {
                        let from = bodies[fromi]!;
                        let to = bodies[toi]!;
                        let force = getGravity({
                            gravity: 0.00002, power: 1,
                            from, to,
                        });
                        for (let object of state[fromi]!) {
                            object.velocity = vector.add(object.velocity, force);
                        }
                        for (let object of state[toi]!) {
                            object.velocity = vector.sub(object.velocity, force);
                        }
                    }
                }
                return state;
            },
        ),
        drawObject({ canvas, object, frame }) {
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
        },
        prerender({ canvas, state }) {
            clearCanvas(canvas);
            zoomToBoundingBox({ canvas, sets: state, scale: 1.2 });
        },
    });
}