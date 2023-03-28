import {
    arrayAnimator, boundingBox, boxCenter, boxesForText, breakIntoLines,
    clearCanvas, colorLayer, combineScenes, fromLayers, gray, layoutOnCanvas,
    modItem, rainbow, reduceAnimators, renderPositionedLayout,
    resolvePrimitiveColor, scene, sceneMeta, staticLayer, traceAnimator, vector,
    velocityStep, zoomToFit,
} from "@/sketcher";

export function loveMeTwoTimes() {
    return combineScenes(
        sceneMeta({
            title: 'Love Me Two Times',
            description: `Poster for The Doors song "Love Me Two Times"`,
        }),
        fromLayers(colorLayer(gray(240))),
        letters('Love me two times, baby'),
        fromLayers(staticLayer(({ canvas }) => {
            let style = {
                fontSize: 1,
                letterBox: {
                    padding: 15,
                    borderColor: 'black',
                    borderWidth: .1,
                },
                padding: {
                    // top: 15,
                },
            };
            let layout = layoutOnCanvas(canvas, {
                direction: 'column',
                justify: 'space-between',
                // crossJustify: 'start',
                padding: 10,
                content: [{
                    justify: 'center',
                    content: [{
                        // text: 'Los Angeles, California',
                        ...style,
                        letterBox: {},
                        // letterBox: undefined,
                    }],
                }, {
                    direction: 'column',
                    content: [{
                        text: 'The Doors',
                        ...style,
                    }, {
                        text: 'Lyrics by Jim Morrison',
                        ...style,
                    }, {
                        text: 'November 1967',
                        ...style,
                    }],
                }],
            });
            renderPositionedLayout({
                layout, canvas,
            });
        }))
    );
}

function letters(text: string) {
    let lines = breakIntoLines(text, 7);
    let boxes = boxesForText({
        lines,
        getDimensions() {
            return { width: 100, height: 100 };
        },
    });
    let vel = 0;
    let state = boxes.map(({ box, letter }) => {
        let center = boxCenter(box);
        return {
            box,
            letter,
            position: center,
            velocity: vector.random({ min: -vel, max: vel }),
            mass: 5,
            anchor: {
                position: center,
                mass: 1,
            },
            trace: {
                position: [center],
            },
        };
    });
    return scene({
        state,
        animator: (reduceAnimators(
            arrayAnimator(function (object) {
                let direction = vector.sub(object.anchor.position, object.position);
                let step = vector.mults(direction, 0.1);
                let d = .2;
                let rand = vector.random({ min: -d, max: d });
                let vel = vector.add(step, rand);
                return {
                    ...object,
                    velocity: vector.add(object.velocity, vel),
                };
            }),
            velocityStep(),
            arrayAnimator(traceAnimator('position', 30)),
        )),
        layers: [{
            prepare({ canvas, state }) {
                canvas.context.translate(0, -canvas.height / 10);
                let padding = 100;
                let points = state.map(o => o.position);
                let bb = boundingBox(points);
                bb.start = vector.add(bb.start, vector.value(-padding));
                bb.end = vector.add(bb.end, vector.value(padding));
                zoomToFit({ box: bb, canvas });
            },
            render({ canvas, state }) {
                canvas.context.save();
                clearCanvas(canvas);
                canvas.context.textAlign = 'center';
                canvas.context.textBaseline = 'middle';
                canvas.context.font = '10vh sans-serif';
                canvas.context.fillStyle = 'orange';
                canvas.context.lineWidth = .2;
                let palette = rainbow({
                    count: 30, s: 100, l: 50,
                });

                for (let { letter, box, trace } of state) {
                    canvas.context.strokeStyle = 'rgb(20, 20, 20)';
                    let i = 0;
                    for (let position of trace.position) {
                        canvas.context.strokeStyle = resolvePrimitiveColor(modItem(palette, i++));
                        canvas.context.strokeText(letter, position.x, position.y);
                    }
                }
                canvas.context.restore();
            },
        }],
    });
}