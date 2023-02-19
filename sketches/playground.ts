import {
    makeStops, velocityStep, gravity, circle, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, gradientLayer,
    Animator, arrayAnimator, Box, randomSubbox,
    randomVectorInBox,
    randomRange,
    WithColor,
    squareNBox,
    zoomToFit,
    centerOnPoint,
    layer,
    rainbow,
    fromRGBA,
    randomVector,
    counter,
    boundingBox,
    clearFrame,
    multBox,
    zoomToFill,
    midpoint,
} from '@/sketcher';

const {
    setCount, count, radiusRange, velocityAmp,
    boxSize, subBoxSize,
    colors, back,
} = {
    setCount: 5,
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

type PlaygroundObject = { n: number }
    & WithPosition & WithVelocity
    & WithRadius & WithMass
    & WithColor
    ;
type PlaygroundState = WithSets<PlaygroundObject[]> & {
    count: number,
};

let box: Box = {
    start: [-boxSize, - boxSize, -boxSize],
    end: [boxSize, boxSize, boxSize],
};

export function playground(): Scene<PlaygroundState> {
    return {
        state: buildState(),
        animator: combineAnimators<PlaygroundState>({
            sets: arrayAnimator(objectsAnimator()),
            count: counter(),
        }),
        layers: [
            background(),
            foreground(),
        ],
    };
}

function buildState(): PlaygroundState {
    let boxes = squareBoxes(setCount);
    let sets = randomSets(count, boxes);
    return {
        count: 0,
        sets,
        // sets: [sets.flat()],
    };
}

function squareBoxes(count: number): Box[] {
    let rows = 5, columns = 5;
    let ns = [0, 17, 3, 7, 9, 4];
    return Array(count)
        .fill(undefined)
        .map(
            (_, idx) => squareNBox({
                n: ns[idx % ns.length]!,
                box,
                depth: subBoxSize,
                rows, columns,
            }),
        );
}

function randomBoxes(count: number): Box[] {
    return Array(count)
        .fill(undefined)
        .map(
            () => randomSubbox({
                box, width: subBoxSize, height: subBoxSize, depth: subBoxSize,
            }),
        );
}

function randomSets(count: number, boxes: Box[]) {
    return boxes.map(
        (currBox, idx) => Array(count).fill(undefined).map<PlaygroundObject>(
            () => {
                let radius = randomRange(radiusRange);
                let color = colors[idx % colors.length]!;
                return {
                    position: randomVectorInBox(currBox),
                    velocity: randomVector({
                        min: -velocityAmp, max: velocityAmp,
                    }),
                    radius,
                    mass: radius,
                    color,
                    // n: Math.floor(randomRange({ max: 10000 }))
                    n: idx * 100,
                };
            },
        ),
    );
}

function objectsAnimator(): Animator<PlaygroundObject[]> {
    return reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );
}

function background(): Layer<PlaygroundState> {
    return gradientLayer(makeStops({
        // 0: '#A1EE35',
        0: fromRGBA(back),
        // 0.8: fromRGBA(multRGBA(back, 1.2)),
        // 1: gray(100),
    }));
}

function foreground(): Layer<PlaygroundState> {
    let cs = rainbow(120);
    return layer(({ canvas, state }) => {
        canvas.context.save();
        // clearFrame({ canvas, color: 'white' });
        zoomToFit({ canvas, box });
        let ps = state.sets.flat().map(o => o.position);
        // zoomToFill({
        //     canvas,
        //     box: multBox(boundingBox(ps), 1.05),
        // });
        centerOnPoint({
            canvas,
            point: midpoint(ps),
        });
        for (let set of state.sets) {
            for (let object of set) {
                circle({
                    lineWidth: 0.5,
                    // fill: object.color,
                    fill: cs[(state.count + object.n) % cs.length]!,
                    stroke: 'black',
                    position: object.position,
                    radius: object.radius,
                    context: canvas.context,
                });
            }
        }
        canvas.context.restore();
    });
}