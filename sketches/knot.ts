import {
  velocityStep, combineLaws, gravity,
  startUniverse, drawObjectAsCircle, drawObjects,
  renderFromTransforms, centerOnMidpoint, zoomToFit, Universe, random3d, randomRange, NumRange, Color,
} from '../sketcher';

export default function knot({
  count, radiusRange, velocityAmp, color,
}: {
  count: number,
  radiusRange: NumRange,
  velocityAmp: number,
  color: Color,
}) {
  return startUniverse({
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
    law: (combineLaws(
      gravity({ gravity: 0.2, power: 2 }),
      gravity({ gravity: -0.002, power: 5 }),
      velocityStep(),
    )),
    render: renderFromTransforms(
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
    period: 20,
    skip: 0,
  });
}