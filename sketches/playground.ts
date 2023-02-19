import {
    fromRGBA, gray, multRGBA, makeStops, toRGBA,
    velocityStep, gravity, circle,
    centerOnMidpoint, zoomToFit, Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, randomObjects, gradientLayer, statelessLayer,
    drawText,
    Animator,
    arrayAnimator,
    objectSetsRender,
} from '@/sketcher';

const {
    count, radiusRange, velocityAmp, boxSize,
    palette: { main, complimentary },
} = {
    count: 10,
    velocityAmp: 0.5,
    boxSize: 100,
    radiusRange: { min: 0.5, max: 5 },
    palette: {
        main: toRGBA('orange'),
        complimentary: { red: 230, green: 230, blue: 230 },
    },
};
let positionRange = { min: -boxSize, max: boxSize };
let velocityRange = { min: -velocityAmp, max: velocityAmp };

type PlaygroundObject = WithPosition & WithRadius & WithMass & WithVelocity;
type PlaygroundState = WithSets<PlaygroundObject[]>;

export function playground(): Scene<PlaygroundState> {
    let background: Layer<PlaygroundState> = gradientLayer(makeStops({
        0: fromRGBA(complimentary),
        0.8: fromRGBA(multRGBA(complimentary, 1.2)),
        1: gray(50),
    }));

    let foreground: Layer<PlaygroundState> = {
        transforms: [
            zoomToFit({
                widthRange: positionRange,
                heightRange: positionRange,
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

    let objects = randomObjects(count, {
        position: positionRange,
        velocity: velocityRange,
        radius: radiusRange,
    }).map(obj => ({ ...obj, mass: obj.radius }));

    let objectsAnimator: Animator<PlaygroundObject[]> = reduceAnimators(
        gravity({ gravity: 0.2, power: 2 }),
        gravity({ gravity: -0.002, power: 5 }),
        velocityStep(),
    );

    let animator = combineAnimators<PlaygroundState>({
        sets: arrayAnimator(objectsAnimator),
    });

    return {
        state: { sets: [objects] },
        animator,
        layers: [
            background,
            foreground,
        ],
    };
}