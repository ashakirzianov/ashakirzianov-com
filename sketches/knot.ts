import {
  fromRGBA, gray, multRGBA, makeStops, toRGBA,
  velocityStep, gravity, circle,
  centerOnMidpoint, zoomToFit, Scene, WithPosition, WithObjects, WithRadius, WithMass, WithVelocity, combineAnimators, Layer, reduceAnimators, randomObjects, gradientLayer, statelessLayer,
  drawText,
} from '@/sketcher';
import { Roboto } from '@next/font/google';
const roboto = Roboto({
  weight: ['900'],
  subsets: ['latin'],
});

// loadFont({
//   name: 'myfont',
//   url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap',
// });

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

type KnotObject = WithPosition & WithRadius & WithMass & WithVelocity;
type KnotState = WithObjects<KnotObject>;

export function knot(): Scene<KnotState> {
  let background: Layer<KnotState> = gradientLayer(makeStops({
    0: fromRGBA(complimentary),
    0.8: fromRGBA(multRGBA(complimentary, 1.2)),
    1: gray(50),
  }));

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

  let text = statelessLayer(function ({ context, width, height }) {
    let unit = Math.floor(height / 256);
    let size = unit * 40;
    let x = unit * 8;
    let y = unit * 220;
    let text = 'Alexander';
    let family = roboto.style.fontFamily;
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

  let animator = combineAnimators<KnotState>({
    objects: (reduceAnimators(
      gravity({ gravity: 0.2, power: 2 }),
      gravity({ gravity: -0.002, power: 5 }),
      velocityStep(),
    )),
  });
  text.hidden = true;

  return {
    state: { objects },
    animator,
    layers: [
      background,
      foreground,
      text,
    ],
  };
}