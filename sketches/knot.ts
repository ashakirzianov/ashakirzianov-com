import {
  velocityStep, combineLaws, gravity,
  drawObjectAsCircle, drawObjects,
  renderFromTransforms, centerOnMidpoint, zoomToFit, Universe, random3d, randomRange, NumRange, Color, Scene,
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
    universe: function (): Universe {
      let dimensions = {
        x: { min: -100, max: 100 },
        y: { min: -100, max: 100 },
        z: { min: -100, max: 100 },
      };
      let objects: any[] = [];
      for (let i = 0; i < count; i++) {
        let radius = randomRange(radiusRange);
        let object = {
          position: random3d({ min: -100, max: 100 }),
          velocity: random3d({ min: -velocityAmp, max: velocityAmp }),
          mass: radius,
          radius,
        }
        objects.push(object);
      }
      return {
        dimensions, objects,
      };
    }(),
    animator: (combineLaws(
      gravity({ gravity: 0.2, power: 2 }),
      gravity({ gravity: -0.002, power: 5 }),
      velocityStep(),
    )),
    renderFrame: renderFromTransforms(
      zoomToFit(),
      centerOnMidpoint(),
      drawObjects({
        drawObject: drawObjectAsCircle({
          lineWidth: 0.5,
          fill: color,
          stroke: 'black',
        })
      }),
    ),
    setupFrame({ canvas: { context, width, height } }) {
      context.save();
      var gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#CCCCCC");
      gradient.addColorStop(0.2, "#DDDDDD");
      gradient.addColorStop(1, "#FFFFFF");

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      context.restore();
    },
  };
}