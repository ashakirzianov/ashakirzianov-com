import {
  fromRGBA, gray, multRGBA, makeStops, toRGBA,
  velocityStep, gravity, circle,
  Scene, WithPosition, WithSets, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, randomObjects, gradientLayer, statelessLayer,
  drawText,
  Animator,
  arrayAnimator,
  objectSetsRender,
  Box,
  zoomToFit,
  transform,
  centerOnPoint,
  midpoint,
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

let box: Box = {
  start: [-boxSize, - boxSize, -boxSize],
  end: [boxSize, boxSize, boxSize],
};

type KnotObject = WithPosition & WithRadius & WithMass & WithVelocity;
type KnotState = WithSets<KnotObject[]>;

export function knot(): Scene<KnotState> {
  let background: Layer<KnotState> = gradientLayer(makeStops({
    0: fromRGBA(complimentary),
    0.8: fromRGBA(multRGBA(complimentary, 1.2)),
    1: gray(50),
  }));

  let foreground: Layer<KnotState> = {
    transforms: [
      transform(canvas => zoomToFit({ canvas, box })),
      transform((canvas, state) => centerOnPoint({
        canvas,
        point: midpoint(state.sets.flat().map(o => o.position)),
      })),
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

  let text = statelessLayer(function ({ context, width, height }) {
    let unit = Math.floor(height / 256);
    let size = unit * 40;
    let x = unit * 8;
    let y = unit * 220;
    let text = 'Alexander';
    let family = 'serif';
    let offset = unit;
    drawText({
      context, size, family, text,
      position: [x + offset, y + offset],
      fill: 'white',
    });
    drawText({
      context, size, family, text,
      position: [x, y],
      fill: 'black',
    });
  });

  let objects = randomObjects(count, {
    position: positionRange,
    velocity: velocityRange,
    radius: radiusRange,
  }).map(obj => ({ ...obj, mass: obj.radius }));

  let objectsAnimator: Animator<KnotObject[]> = reduceAnimators(
    gravity({ gravity: 0.2, power: 2 }),
    gravity({ gravity: -0.002, power: 5 }),
    velocityStep(),
  );

  let animator = combineAnimators<KnotState>({
    sets: arrayAnimator(objectsAnimator),
  });
  text.hidden = true;

  return {
    state: { sets: [objects] },
    animator,
    layers: [
      background,
      foreground,
      text,
    ],
  };
}