import {
  velocityStep, combineLaws, gravity,
  circle,
  renderFromTransforms, centerOnMidpoint, zoomToFit, Universe, random3d, randomRange, NumRange, Color, Scene, Canvas, rangeArray,
} from '../sketcher';

export default function knot({
  count, radiusRange, velocityAmp, color,
}: {
  count: number,
  radiusRange: NumRange,
  velocityAmp: number,
  color: Color,
}): Scene {
  return {
    universe: {
      dimensions: {
        x: { min: -100, max: 100 },
        y: { min: -100, max: 100 },
        z: { min: -100, max: 100 },
      },
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
    animator: (combineLaws(
      gravity({ gravity: 0.2, power: 2 }),
      gravity({ gravity: -0.002, power: 5 }),
      velocityStep(),
    )),
    renderFrame: renderFromTransforms(
      zoomToFit(),
      centerOnMidpoint(),
      function () {
        return function ({ universe, canvas }) {
          for (let object of universe.objects) {
            circle({
              lineWidth: 0.5,
              fill: color,
              stroke: 'black',
              position: object.position,
              radius: object.radius,
              context: canvas.context,
            });
          }
        }
      },
    ),
    setupFrame({ canvas }) {
      corner({ canvas, offset: 0.4, angle: 0.7 });
    },
  };
}

function corner({
  canvas: { context, width, height },
  offset, angle,
}: {
  canvas: Canvas,
  offset: number,
  angle: number,
}) {
  function wall({ context, width, height }: Canvas) {
    context.save();
    var gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#DDDDDD");
    gradient.addColorStop(1, "#FFFFFF");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 2;
    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(0, height);
    context.lineTo(width, height);
    context.lineTo(width, 0);
    context.stroke();
    context.restore();
  }
  let skew = Math.cos(-Math.PI * angle);
  context.save();
  context.translate(-offset * width, 0);
  context.transform(1, skew, 0, 1, 0, 0);
  wall({ context, width, height });
  context.restore();
  context.save();
  context.scale(-1, 1);
  context.translate(-width, 0);
  context.translate(-(1 - offset) * width, 0);
  context.transform(1, skew, 0, 1, 0, 0);
  wall({ context, width, height });
  context.restore();
}

function colorRect({ context, width, height }: Canvas) {
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, height);
  context.strokeStyle = 'red';
  context.stroke();
  context.beginPath();
  context.moveTo(0, height);
  context.lineTo(width, height);
  context.strokeStyle = 'green';
  context.stroke();
  context.beginPath();
  context.moveTo(width, height);
  context.lineTo(width, 0);
  context.strokeStyle = 'blue';
  context.stroke();
  context.beginPath();
  context.moveTo(width, 0);
  context.lineTo(0, 0);
  context.strokeStyle = 'orange';
  context.stroke();
}