import {
    makeStops, velocityStep, gravity, circle, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, gradientLayer,
    Animator, arrayAnimator, Box, randomSubbox,
    randomVectorInBox, randomRange, WithColor, squareNBox, zoomToFit, centerOnPoint, layer,
    rainbow, fromRGBA, randomVector, counter,
    boundingBox, clearFrame, multBox, zoomToFill,
    midpoint, gray, multRGBA, colorLayer,
    Color, RGBAColor, cubicBox, NumRange, removeUndefined, Canvas, boxSize,
} from '@/sketcher';

type KnotsObjectT = WithPosition & WithVelocity & WithRadius & WithMass & WithColor & {
    group: number,
    rand: number,
};
type KnotsStateT = WithSets<KnotsObjectT[]> & {
    count: number,
};

export function current() {
    return knots({
        setCount: 5,
        count: 20,
        velocityAmp: 1,
        boxSize: 250,
        subBoxSize: 10,
        radiusRange: { min: 0.5, max: 17 },
        colors: [
            '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
        ],
        complimentary: [230, 230, 230],
    });
}

function knots({
    setCount, count, radiusRange, velocityAmp,
    boxSize, subBoxSize,
    colors, complimentary,
}: {
    setCount: number,
    count: number,
    velocityAmp: number,
    boxSize: number,
    subBoxSize: number,
    radiusRange: NumRange,
    colors: Color[],
    complimentary: Color,
}): Scene<KnotsStateT> {
    let box: Box = cubicBox(boxSize);
    let ns = [0, 17, 3, 7, 9, 4];
    let boxes = squareBoxes({
        box, count: setCount,
        rows: 5, columns: 5,
        getSquareN: idx => ns[idx % ns.length]!,
    });

    return makeKnots<KnotsObjectT>({
        boxes,
        createObjects(currBox, idx) {
            return Array(count).fill(undefined).map<KnotsObjectT>(
                () => {
                    let radius = randomRange(radiusRange);
                    let cl = colors[idx % colors.length]!;
                    return {
                        position: randomVectorInBox(currBox),
                        velocity: randomVector({
                            min: -velocityAmp, max: velocityAmp,
                        }),
                        radius,
                        mass: radius / 4,
                        color: cl,
                        rand: Math.floor(randomRange({ max: 10000 })),
                        group: idx,
                    };
                },
            );
        },
        animator: objectsAnimator(),
        drawObject({ canvas, object }) {
            circle({
                lineWidth: 0.5,
                fill: object.color,
                stroke: 'black',
                position: object.position,
                radius: object.radius,
                context: canvas.context,
            });
        },
        background: () => complimentary,
    });
}

type KnotsObject = WithPosition & WithVelocity & WithMass;
type KnotsState<ObjectT extends KnotsObject> = WithSets<ObjectT[]> & {
    count: number,
};
type DrawObjectProps<ObjectT> = {
    canvas: Canvas,
    object: ObjectT,
    batch: number,
    index: number,
}
function makeKnots<ObjectT extends KnotsObject>({
    boxes, flatten,
    createObjects, animator, drawObject,
    background,
}: {
    boxes: Box[],
    createObjects: (box: Box, idx: number) => ObjectT[],
    animator: Animator<ObjectT[]>,
    drawObject: (props: DrawObjectProps<ObjectT>) => void,
    background?: (state: KnotsState<ObjectT>) => Color,
    zoomToBox?: (state: KnotsState<ObjectT>) => Box,
    zoomOnRender?: (state: KnotsState<ObjectT>) => Box,
    flatten?: boolean,
}): Scene<KnotsState<ObjectT>> {
    let sets = boxes.map(createObjects);
    if (flatten) {
        sets = [sets.flat()];
    }
    let state: KnotsState<ObjectT> = {
        count: 0,
        sets,
    };

    return {
        state,
        animator: combineAnimators<KnotsState<ObjectT>>({
            sets: arrayAnimator(animator),
            count: counter(),
        }),
        layers: [
            background
                ? backgroundLayer(background(state))
                : backgroundLayer('transparent'),
            foregroundLayer({ drawObject }),
        ],
    };
}

function squareBoxes({
    count, rows, columns, getSquareN, box,
}: {
    count: number,
    rows: number,
    columns: number,
    getSquareN: (idx: number) => number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            (_, idx) => squareNBox({
                n: getSquareN(idx),
                box,
                depth: boxSize(box).width / columns,
                rows, columns,
            }),
        );
}

function objectsAnimator(): Animator<KnotsObjectT[]> {
    return reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );
}

function backgroundLayer(color: Color) {
    return colorLayer(color);
}

function foregroundLayer<ObjectT extends KnotsObject>({
    drawObject
}: {
    drawObject: (props: DrawObjectProps<ObjectT>) => void,
}): Layer<KnotsState<ObjectT>> {
    let cs = rainbow(120);
    return {
        prepare({ canvas, state }) {
            let ps = state.sets.flat().map(o => o.position);
            zoomToFit({
                canvas,
                box: multBox(boundingBox(ps), 1.1),
            });
        },
        render({ canvas, state }) {
            canvas.context.save();
            // clearFrame({ canvas, color: 'white' });
            // let ps = state.sets.flat().map(o => o.position);
            // zoomToFit({
            //     canvas,
            //     box: multBox(boundingBox(ps), 1.05),
            // });
            for (let seti = 0; seti < state.sets.length; seti++) {
                let set = state.sets[seti]!;
                for (let obji = 0; obji < set.length; obji++) {
                    let object = set[obji]!;
                    drawObject({
                        canvas, object,
                        batch: seti,
                        index: obji,
                    });
                }
            }
            canvas.context.restore();
        },
    };
}