import {
    makeStops, velocityStep, gravity, circle, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, gradientLayer,
    Animator, arrayAnimator, Box, randomSubbox,
    randomVectorInBox, randomRange, WithColor, squareNBox, zoomToFit, centerOnPoint, layer,
    rainbow, fromRGBA, randomVector, counter,
    boundingBox, clearFrame, multBox, zoomToFill,
    midpoint, gray, multRGBA, colorLayer,
    Color, RGBAColor, cubicBox, NumRange,
} from '@/sketcher';

type KnotsObject = WithPosition & WithVelocity & WithRadius & WithMass & WithColor & {
    group: number,
    rand: number,
};
type KnotsState = WithSets<KnotsObject[]> & {
    count: number,
};

export function knots({
    setCount, count, radiusRange, velocityAmp,
    boxSize, subBoxSize,
    colors, complimentary,
}: {
    setCount: 5,
    count: 20,
    velocityAmp: 1,
    boxSize: 250,
    subBoxSize: 10,
    radiusRange: NumRange,
    colors: [
        '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
    ],
    complimentary: Color,
}): Scene<KnotsState> {
    let back: Color = complimentary;

    let box: Box = cubicBox(boxSize);
    function buildState(): KnotsState {
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
            (currBox, idx) => Array(count).fill(undefined).map<KnotsObject>(
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
            ),
        );
    }

    return {
        state: buildState(),
        animator: combineAnimators<KnotsState>({
            sets: arrayAnimator(objectsAnimator()),
            count: counter(),
        }),
        layers: [
            background(back),
            foreground(),
        ],
    };
}

function objectsAnimator(): Animator<KnotsObject[]> {
    return reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );
}

function background(color: Color) {
    return colorLayer(color);
}

function foreground(): Layer<KnotsState> {
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
            for (let set of state.sets) {
                for (let object of set) {
                    circle({
                        lineWidth: 0.5,
                        fill: object.color,
                        // fill: cs[(state.count + object.n) % cs.length]!,
                        stroke: 'black',
                        position: object.position,
                        radius: object.radius,
                        context: canvas.context,
                    });
                }
            }
            canvas.context.restore();
        },
    };
}