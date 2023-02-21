import {
    velocityStep, gravity, circle, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators,
    Animator, arrayAnimator, Box, randomSubbox,
    randomVectorInBox, randomRange, squareNBox, zoomToFit,
    rainbow, randomVector, counter,
    boundingBox, clearFrame, multBox,
    midpoint, gray, multRGBA, colorLayer,
    Color, RGBAColor, cubicBox, NumRange, removeUndefined, Canvas, boxSize, Render, modItem, randomInt, rectBox, dynamicColorLayer, hueRange, pulsating, ColorGetter, Vector, vals, addVector, ColorOrGetter, makeStops, fromRGBA, getColor,
} from '@/sketcher';

export const variations = [
    raveVariation(),
    randomBatchesVariation(),
    original(),
];

export function current() {
    return raveVariation();
}

export function original() {
    let box = cubicBox(200);
    let batchRange = { min: 20, max: 20 };
    let maxVelocity = 0.5;
    let massRange = { min: 0.5, max: 5 };
    let complimentary = { red: 230, green: 230, blue: 230 };
    return makeKnots({
        boxes: [box],
        background: {
            kind: 'gradient',
            start: [0, 0], end: [0, 1],
            stops: makeStops({
                0: fromRGBA(complimentary),
                0.8: fromRGBA(multRGBA(complimentary, 1.2)),
                1: gray(50),
            }),
        },
        createObjects(box, bi) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(function () {
                let obj = randomObject({
                    massRange, maxVelocity, box,
                    rToM: 1,
                });
                return obj;
            });
        },
        drawObject: circleObjectForColor('orange'),
        zoomToBox: stateBoundingBox(1),
    });
}

export function raveVariation() {
    let batchRange = { min: 10, max: 10 };
    let maxVelocity = 1;
    let massRange = { min: 0.1, max: 4 };
    let veld = 1;
    let vels: Vector[] = [
        [veld, veld, 0],
        [-veld, veld, 0],
        [veld, -veld, 0],
        [-veld, -veld, 0],
    ];
    let size = 1;
    return makeKnots({
        boxes: cornerBoxes({ rows: 3 * size, cols: 4 * size }),
        background: counterColor(pulsating(hueRange({
            from: 0, to: 360, count: 200,
            s: 50, l: 90,
        }))),
        // background: gray(250),
        createObjects(box, bi) {
            let batch = Math.floor(randomRange(batchRange));
            return vals(batch).map(function () {
                let obj = randomObject({
                    massRange, maxVelocity, box,
                    rToM: 2,
                });
                obj.velocity = addVector(obj.velocity, vels[bi]!);
                return obj;
            });
        },
        drawObject: circleObjectForColor(
            colorGetter(
                (obj, count) => obj.batch * 100 + count,
                paletteColor(rainbow({ count: 120 })),
            ),
        ),
        zoomToBox: stateBoundingBox(1.5),
        animator: reduceAnimators(
            gravity({ gravity: 0.02, power: 2 }),
            gravity({ gravity: -0.002, power: 4 }),
            velocityStep(),
        ),
        flatten: true,
    });
}

export function randomBatchesVariation() {
    let batchRange = { min: 5, max: 20 };
    let batches = 7;
    let maxVelocity = 5;
    let massRange = { min: 0.1, max: 4 };
    return makeKnots({
        boxes: randomBoxes({
            box: cubicBox(500),
            size: 250,
            count: batches,
        }),
        background: () => gray(230),
        // background: pulsatingRainbow(),
        createObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return Array(batch).fill(undefined).map(
                () => randomObject({
                    massRange, maxVelocity, box, rToM: 4,
                }),
            );
        },
        drawObject: circleObjectForColor(
            ({ object }) => modItem(calmPalette, object.batch),
        ),
        zoomToBox: stateBoundingBox(1.2),
    });
}

type Particle = WithPosition & WithVelocity & WithMass & WithRadius;
type Data = {
    batch: number,
    index: number,
    rand: number,
}
type Object = Particle & Data;
type State = WithSets<Object[]> & {
    count: number,
};
type DrawObjectProps = {
    canvas: Canvas,
    object: Object,
    count: number,
}
type DrawObject = (props: DrawObjectProps) => void;
function makeKnots({
    boxes, flatten,
    createObjects, drawObject, animator,
    background,
    zoomToBox, zoomOnRender, clearColor,
}: {
    boxes: Box[],
    createObjects: (box: Box, idx: number) => Particle[],
    drawObject: DrawObject,
    background?: ColorOrGetter<State>,
    zoomToBox?: (state: State) => Box,
    zoomOnRender?: (state: State) => Box,
    clearColor?: (state: State) => Color,
    flatten?: boolean,
    animator?: Animator<Object[]>,
}): Scene<State> {
    let sets = boxes.map(
        (box, batch) => createObjects(box, batch).map(
            (object, index) => ({
                ...object, batch, index, rand: Math.random(),
            }),
        ),
    );
    if (flatten) {
        sets = [sets.flat()];
    }
    let state: State = {
        count: 0,
        sets,
    };

    let backgroundLayer = typeof background === 'function' ? dynamicColorLayer(background)
        : background === undefined ? colorLayer('transparent')
            : colorLayer(background);

    return {
        state,
        animator: combineAnimators<State>({
            sets: arrayAnimator(animator ?? objectsAnimator()),
            count: counter(),
        }),
        layers: [
            backgroundLayer,
            foregroundLayer({
                drawObject, zoomToBox, zoomOnRender, clearColor,
            }),
        ],
    };
}

function cornerBoxes({ rows, cols }: {
    rows: number,
    cols: number,
}): Box[] {
    let aspect = rows / cols;
    let ns = [
        0, cols - 1,
        cols * (rows - 1), cols * rows - 1,
    ];
    return squareBoxes({
        box: rectBox(500 * aspect, 500),
        count: 4, rows, cols,
        getSquareN: n => ns[n]!,
    });
}

function squareBoxes({
    count, rows, cols, getSquareN, box,
}: {
    count: number,
    rows: number,
    cols: number,
    getSquareN: (idx: number) => number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            (_, idx) => squareNBox({
                n: getSquareN(idx),
                box,
                depth: boxSize(box).width / cols,
                rows, cols,
            }),
        );
}

function stateBoundingBox(padding: number) {
    return function (state: State) {
        let ps = state.sets.flat().map(o => o.position);
        return multBox(boundingBox(ps), padding);
    }
}

function randomObject({
    massRange, maxVelocity, box, rToM,
}: {
    box: Box,
    massRange: NumRange,
    maxVelocity: number,
    rToM: number,
}) {
    let mass = randomRange(massRange);
    let velocityRange = {
        min: -maxVelocity, max: maxVelocity,
    };
    return {
        position: randomVectorInBox(box),
        velocity: randomVector(velocityRange),
        mass,
        radius: mass * (rToM ?? 4),
    };
}

type GetColor = ColorOrGetter<{ object: Object, count: number }>;
function circleObjectForColor(getter: GetColor): DrawObject {
    return function drawObject({ canvas, object, count }) {
        let fill = getColor(getter, ({ object, count }));
        circle({
            lineWidth: 0.5,
            fill,
            stroke: 'black',
            position: object.position,
            radius: object.radius,
            context: canvas.context,
        });
    };
}

function randomBoxes({ count, size, box }: {
    count: number,
    size: number,
    box: Box,
}): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            () => randomSubbox({
                box,
                width: size,
                height: size,
                depth: size,
            }),
        );
}

function objectsAnimator(): Animator<Object[]> {
    return reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );
}

function foregroundLayer({
    drawObject, zoomToBox, zoomOnRender, clearColor,
}: {
    drawObject: DrawObject,
    zoomToBox?: (state: State) => Box,
    zoomOnRender?: (state: State) => Box,
    clearColor?: (state: State) => Color,
}): Layer<State> {
    return {
        prepare({ canvas, state }) {
            if (zoomToBox) {
                let box = zoomToBox(state);
                zoomToFit({ canvas, box });
            }
        },
        render({ canvas, state }) {
            canvas.context.save();
            if (clearColor) {
                clearFrame({
                    canvas, color: clearColor(state),
                });
            }
            if (zoomOnRender) {
                let box = zoomOnRender(state);
                zoomToFit({ canvas, box });
            }
            for (let seti = 0; seti < state.sets.length; seti++) {
                let set = state.sets[seti]!;
                for (let obji = 0; obji < set.length; obji++) {
                    let object = set[obji]!;
                    drawObject({
                        canvas, object,
                        count: state.count,
                    });
                }
            }
            canvas.context.restore();
        },
    };
}

let calmPalette: Color[] = [
    '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
];

type NToColor = (n: number) => Color;
function paletteColor(palette: Color[]): NToColor {
    return (n: number) => modItem(palette, n);
}

function colorGetter<T>(
    objToX: (obj: Object, count: number) => T,
    xToColor: (x: T) => Color,
): GetColor {
    return ({ object, count }) => xToColor(objToX(object, count));
}

function counterColor(palette: Color[]): ColorGetter<State> {
    return state => modItem(palette, state.count);
}

function pulsatingRainbow(): ColorGetter<State> {
    let palette = pulsating(hueRange({
        from: 0, to: 360, count: 20,
        s: 70, l: 90,
    }));
    return state => modItem(palette, state.count);
}