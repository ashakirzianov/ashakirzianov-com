import {
    fromRGBA, gray, multRGBA, makeStops, toRGBA,
    velocityStep, gravity, circle,
    centerOnMidpoint, zoomToFit, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, randomObjects, gradientLayer,
    Animator,
    arrayAnimator,
    objectSetsRender,
    Box,
    randomSubbox,
    randomVectorInBox,
    randomRange,
} from '@/sketcher';
import vector from '@/sketcher/vector';

const {
    setCount, count, radiusRange, velocityAmp,
    boxSize, subBoxSize,
    main, back,
} = {
    setCount: 10,
    count: 10,
    velocityAmp: 0.5,
    boxSize: 200,
    subBoxSize: 50,
    radiusRange: { min: 0.5, max: 5 },
    back: { red: 230, green: 230, blue: 230 },
    main: toRGBA('orange'),
};

type PlaygroundObject = WithPosition & WithRadius & WithMass & WithVelocity;
type PlaygroundState = WithSets<PlaygroundObject[]>;

export function playground(): Scene<PlaygroundState> {
    let box: Box = {
        start: [-boxSize, - boxSize, -boxSize],
        end: [boxSize, boxSize, boxSize],
    };
    let boxes = Array(setCount)
        .fill(undefined)
        .map(
            () => randomSubbox({
                box, width: subBoxSize, height: subBoxSize, depth: subBoxSize,
            }),
        );
    let sets = boxes.map(
        box => Array(count).fill(undefined).map<PlaygroundObject>(
            () => {
                let radius = randomRange(radiusRange);
                return {
                    position: randomVectorInBox(box),
                    velocity: vector.random3d({
                        min: -velocityAmp, max: velocityAmp,
                    }),
                    radius,
                    mass: radius,
                };
            },
        ),
    );

    let state: PlaygroundState = { sets };
    let background: Layer<PlaygroundState> = gradientLayer(makeStops({
        0: fromRGBA(back),
        0.8: fromRGBA(multRGBA(back, 1.2)),
        1: gray(100),
    }));

    let foreground: Layer<PlaygroundState> = {
        transforms: [
            zoomToFit({
                widthRange: { min: box.start[0], max: box.end[0] },
                heightRange: { min: box.start[1], max: box.end[1] },
            }),
            centerOnMidpoint(state => state.sets.flat()),
        ],
        render: objectSetsRender(({ canvas, object }) => circle({
            lineWidth: 0.5,
            fill: fromRGBA(main),
            stroke: 'black',
            position: object.position,
            radius: object.radius,
            context: canvas.context,
        }))
    };

    let objectsAnimator: Animator<PlaygroundObject[]> = reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );

    let animator = combineAnimators<PlaygroundState>({
        sets: arrayAnimator(objectsAnimator),
    });

    return {
        state,
        animator,
        layers: [
            background,
            foreground,
        ],
    };
}