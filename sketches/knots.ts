import {
    makeStops, velocityStep, gravity, circle, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, gradientLayer,
    Animator, arrayAnimator, Box, randomSubbox,
    randomVectorInBox, randomRange, WithColor, squareNBox, zoomToFit, centerOnPoint, layer,
    rainbow, fromRGBA, randomVector, counter,
    boundingBox, clearFrame, multBox, zoomToFill,
    midpoint, gray, multRGBA, colorLayer,
    Color, RGBAColor, cubicBox, NumRange, removeUndefined, Canvas, boxSize, Render, modItem, randomInt,
} from '@/sketcher';

export function current() {
    return randomBatchesVariation();
}

function randomBatchesVariation() {
    let colors = [
        '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
    ];
    let batchRange = { min: 5, max: 20 };
    let batches = 7;
    let maxVelocity = 5; // Math.random() * 5;
    let massRange = { min: 0.1, max: 4 };
    return makeKnots({
        boxes: randomBoxes({
            box: cubicBox(500),
            size: 250,
            count: batches,
        }),
        background: () => gray(230),
        createObjects(box) {
            let batch = Math.floor(randomRange(batchRange));
            return Array(batch).fill(undefined).map(
                () => randomObject({
                    massRange, maxVelocity, box, rToM: 4,
                }),
            );
        },
        drawObject: circleObjectForColor(
            obj => modItem(colors, obj.batch),
        ),
        zoomToBox: stateBoundingBox,
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
    background?: (state: State) => Color,
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

    return {
        state,
        animator: combineAnimators<State>({
            sets: arrayAnimator(animator ?? objectsAnimator()),
            count: counter(),
        }),
        layers: [
            background
                ? backgroundLayer(background(state))
                : backgroundLayer('transparent'),
            foregroundLayer({
                drawObject, zoomToBox, zoomOnRender, clearColor,
            }),
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

function stateBoundingBox(state: State) {
    let ps = state.sets.flat().map(o => o.position);
    return multBox(boundingBox(ps), 1.2);
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

type GetColor = (object: Object, count: number) => Color;
function circleObjectForColor(getColor: GetColor): DrawObject {
    return function drawObject({ canvas, object, count }) {
        let fill = getColor(object, count);
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

function backgroundLayer(color: Color) {
    return colorLayer(color);
}

function foregroundLayer({
    drawObject, zoomToBox, zoomOnRender, clearColor,
}: {
    drawObject: DrawObject,
    zoomToBox?: (state: State) => Box,
    zoomOnRender?: (state: State) => Box,
    clearColor?: (state: State) => Color,
}): Layer<State> {
    let cs = rainbow(120);
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