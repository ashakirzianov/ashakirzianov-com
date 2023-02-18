import {
  fromRGBA, gray, multRGBA, makeStops, toRGBA,
  velocityStep, gravity, circle,
  centerOnMidpoint, zoomToFit, Scene, WithPosition, WithObjects, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, fillGradient, reduceAnimators, randomObjects, createObjects,
} from '@/sketcher';

const {
  count, radiusRange, velocityAmp, boxSize,
  palette: { main, complimentary },
} = {
  count: 8,
  velocityAmp: 0.5,
  boxSize: 100,
  radiusRange: { min: 0.5, max: 5 },
  palette: {
    main: toRGBA('orange'),
    complimentary: { red: 230, green: 230, blue: 230 },
  },
};

type KnotObject = WithPosition & WithRadius & WithMass & WithVelocity;
type KnotState = WithObjects<KnotObject>;

export function knot(): Scene<KnotState> {
  let positionRange = { min: -boxSize, max: boxSize };
  let velocityRange = { min: -velocityAmp, max: velocityAmp };
  let background: Layer<KnotState> = {
    render({ canvas }) {
      fillGradient({
        canvas,
        stops: makeStops({
          0: fromRGBA(complimentary),
          0.8: fromRGBA(multRGBA(complimentary, 1.2)),
          1: gray(50),
        }),
      });
    },
    static: true,
  };

  let foreground: Layer<KnotState> = {
    transforms: [
      zoomToFit({
        widthRange: positionRange,
        heightRange: positionRange,
      }),
      centerOnMidpoint(),
    ],
    render({ state, canvas }) {
      for (let object of state.objects) {
        circle({
          lineWidth: 0.5,
          fill: fromRGBA(main),
          stroke: 'black',
          position: object.position,
          radius: object.radius,
          context: canvas.context,
        });
      }
    },
  };

  let objects = randomObjects(count, {
    position: positionRange,
    velocity: velocityRange,
    radius: radiusRange,
  }).map(obj => ({ ...obj, mass: obj.radius }));

  let animator = combineAnimators<KnotState>({
    objects: (reduceAnimators(
      gravity({ gravity: 0.2, power: 2 }),
      gravity({ gravity: -0.002, power: 5 }),
      velocityStep(),
    )),
  });

  return {
    state: { objects },
    animator,
    layers: [
      background, foreground,
    ],
  };
}