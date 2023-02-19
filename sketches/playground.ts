import {
    fromRGBA, gray, multRGBA, makeStops, toRGBA,
    velocityStep, gravity, circle,
    centerOnMidpoint, zoomToFit, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, gradientLayer,
    Animator,
    arrayAnimator,
    objectSetsRender,
    Box,
    randomSubbox,
    randomVectorInBox,
    randomRange,
    WithColor,
    squareNBox,
} from '@/sketcher';
import vector from '@/sketcher/vector';

const {
    setCount, count, radiusRange, velocityAmp,
    boxSize, subBoxSize,
    colors, back,
} = {
    setCount: 4,
    count: 10,
    velocityAmp: 1,
    boxSize: 250,
    subBoxSize: 10,
    radiusRange: { min: 0.5, max: 7 },
    back: { red: 230, green: 230, blue: 230 },
    colors: [
        '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
    ],
};

type PlaygroundObject = {}
    & WithPosition & WithVelocity
    & WithRadius & WithMass
    & WithColor
    ;
type PlaygroundState = WithSets<PlaygroundObject[]>;

let box: Box = {
    start: [-boxSize, - boxSize, -boxSize],
    end: [boxSize, boxSize, boxSize],
};

export function playground(): Scene<PlaygroundState> {
    return {
        state: separateSets(),
        animator: combineAnimators<PlaygroundState>({
            sets: arrayAnimator(objectsAnimator()),
        }),
        layers: [
            background(),
            foreground(),
        ],
    };
}

function singleSet(): PlaygroundState {
    let rows = 5, columns = 5;
    // let ns = Array(rows * columns).fill(0).map(
    //     (_, idx) => idx,
    //     );
    let ns = [0, 17, 3, 7, 9, 4];
    let boxCount = setCount;
    let boxes = Array(boxCount)
        .fill(undefined)
        .map(
            (_, idx) => squareNBox({
                // n: randomRange({ min: 0, max: 5 * 5 }),
                n: ns[idx % ns.length]!,
                box,
                depth: subBoxSize,
                rows, columns,
            }),
        );
    let sets = boxes.map(
        (currBox, idx) => Array(count).fill(undefined).map<PlaygroundObject>(
            () => {
                let radius = randomRange(radiusRange);
                let color = colors[idx % colors.length]!;
                return {
                    position: randomVectorInBox(currBox),
                    velocity: vector.random3d({
                        min: -velocityAmp, max: velocityAmp,
                    }),
                    // velocity: [50, 10, 10],
                    radius,
                    mass: radius,
                    color,
                };
            },
        ),
    );
    return { sets: [sets.flat()] };
}

function separateSets(): PlaygroundState {
    let boxes = Array(setCount)
        .fill(undefined)
        .map(
            () => randomSubbox({
                box, width: subBoxSize, height: subBoxSize, depth: subBoxSize,
            }),
        );
    let sets = boxes.map(
        (box, idx) => Array(count).fill(undefined).map<PlaygroundObject>(
            () => {
                let radius = randomRange(radiusRange);
                let color = colors[idx % colors.length]!;
                return {
                    position: randomVectorInBox(box),
                    velocity: vector.random3d({
                        min: -velocityAmp, max: velocityAmp,
                    }),
                    radius,
                    mass: radius,
                    color,
                };
            },
        ),
    );
    return { sets };
}

function objectsAnimator(): Animator<PlaygroundObject[]> {
    return reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );
}

function background(): Layer<PlaygroundState> {
    // return gradientLayer(makeStops({
    //     0: fromRGBA(back),
    //     0.8: fromRGBA(multRGBA(back, 1.2)),
    //     1: gray(100),
    // }));
    return gradientLayer(makeStops({
        0: '#A1C935',
    }));
}

function foreground(): Layer<PlaygroundState> {
    return {
        // static: true,
        transforms: [
            zoomToFit({
                widthRange: { min: box.start[0], max: box.end[0] },
                heightRange: { min: box.start[1], max: box.end[1] },
            }),
            centerOnMidpoint(state => state.sets.flat()),
        ],
        render: objectSetsRender(({ canvas, object }) => circle({
            lineWidth: 0.5,
            fill: object.color,
            stroke: 'black',
            position: object.position,
            radius: object.radius,
            context: canvas.context,
        }))
    };
}