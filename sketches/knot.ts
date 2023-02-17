import { fromRGBA, gray, multRGBA, makeStops, unifromStops, toRGBA } from '@/sketcher/color';
import {
  velocityStep, combineLaws, gravity,
  circle,
  centerOnMidpoint, zoomToFit, random3d, randomRange, NumRange, Scene, Canvas, rangeArray, ColorStop, RGBAColor, WithPosition, WithObjects, WithRadius, WithMass, WithVelocity, combineAnimators, scene,
} from '../sketcher';

type KnotObject = WithPosition & WithRadius & WithMass & WithVelocity;
type KnotState = WithObjects<KnotObject>;

let {
  count, radiusRange, velocityAmp, variant,
  palette: { main, complimentary },
} = {
  count: 8,
  velocityAmp: 0.5,
  radiusRange: { min: 0.5, max: 5 },
  palette: {
    main: toRGBA('orange'),
    complimentary: { red: 230, green: 230, blue: 230 },
  },
  variant: 'gradient',
};

export const knot = scene({
  state: {
    objects: rangeArray({ min: 0, max: count }).map(() => {
      let radius = randomRange(radiusRange);
      return {
        position: random3d({ min: -100, max: 100 }),
        velocity: random3d({ min: -velocityAmp, max: velocityAmp }),
        mass: radius,
        radius,
      };
    }),
  },
  animator: combineAnimators({
    objects: (combineLaws(
      gravity({ gravity: 0.2, power: 2 }),
      gravity({ gravity: -0.002, power: 5 }),
      velocityStep(),
    )),
  }),
  layers: [
    {
      static: true,
      render({ canvas }) {
        switch (variant) {
          case 'corner':
            corner({
              canvas,
              color: complimentary,
              offset: 0.3, angle: 0.7,
            });
            break;
          case 'gradient':
            gradient({
              canvas,
              stops: makeStops({
                0: fromRGBA(complimentary),
                0.2: fromRGBA(multRGBA(complimentary, 1.2)),
                1: gray(255),
              }),
            });
            break;
          default:
            break;
        }
      },
    },
    {
      transforms: [
        zoomToFit({
          widthRange: { min: -100, max: 100 },
          heightRange: { min: -100, max: 100 },
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
    },
  ],
});

function gradient({
  canvas: { context, width, height },
  stops,
}: {
  canvas: Canvas,
  stops: ColorStop[],
}) {
  context.save();
  var gradient = context.createLinearGradient(0, 0, 0, height);
  stops.forEach(
    ({ offset, color }) => gradient.addColorStop(offset, color),
  );

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function corner({
  canvas, offset, angle, border, color,
}: {
  canvas: Canvas,
  offset: number,
  angle: number,
  border?: number,
  color: RGBAColor,
}) {
  let { context, width, height } = canvas;
  context.save();

  function wall({
    stops, border,
  }: {
    stops: ColorStop[],
    border?: number,
  }) {
    context.save();
    var gradient = context.createLinearGradient(0, 0, 0, height);
    stops.forEach(
      ({ offset, color }) => gradient.addColorStop(offset, color),
    );

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (border) {
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.beginPath();
      context.moveTo(0, height);
      context.lineTo(width, height);
      context.lineTo(width, 0);
      context.stroke();
    }
    context.restore();
  }

  let base = fromRGBA(color);
  let lightest = fromRGBA(multRGBA(color, 1.2));
  let light = fromRGBA(multRGBA(color, 1.05));
  let dark = fromRGBA(multRGBA(color, 0.95));
  context.fillStyle = lightest;
  context.fillRect(0, 0, width, height);
  let skew = Math.cos(-Math.PI * angle);
  context.save();
  context.translate(-offset * width, 0);
  context.transform(1, skew, 0, 1, 0, 0);
  wall({
    stops: unifromStops([base, light]),
    border,
  });
  context.restore();
  context.save();
  context.scale(-1, 1);
  context.translate(-width, 0);
  context.translate(-(1 - offset) * width, 0);
  context.transform(1, skew, 0, 1, 0, 0);
  wall({
    stops: unifromStops([dark, base]),
    border,
  });
  context.restore();

  context.restore();
}