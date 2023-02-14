import { Color, NumRange, Universe, UniverseObject, Vector } from "./base";
import vector from "./vector";

export type Canvas = {
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
};
export type RenderProps = {
    canvas: Canvas,
    universe: Universe,
};
export type Render = (props: RenderProps) => void;
export type RenderTransform = (render: Render) => Render;

export function clearFrame({ color }: {
    color: Color,
}): RenderTransform {
    return function (render) {
        return function ({ canvas, universe }) {
            canvas.context.save();
            canvas.context.fillStyle = color;
            canvas.context.fillRect(0, 0, canvas.width, canvas.height);
            render({ canvas, universe });
            canvas.context.restore();
        }
    }
}

export function zoomToFit(): RenderTransform {
    return function zoomToFitTransform(render) {
        function rangeLength({ min, max }: NumRange) {
            return max - min;
        }

        return function ({ canvas, universe }) {
            canvas.context.save();
            let uwidth = rangeLength(universe.dimensions.x);
            let uheight = rangeLength(universe.dimensions.y);
            let xratio = canvas.width / uwidth;
            let yratio = canvas.height / uheight;
            let ratio = Math.min(xratio, yratio);
            canvas.context.scale(ratio, ratio);
            canvas.context.translate(-universe.dimensions.x.min, -universe.dimensions.y.min);
            render({ canvas, universe });
            canvas.context.restore();
        }
    }
}

export function centerOnObject({ index }: {
    index: number,
}): RenderTransform {
    return function transform(render) {
        return function ({ canvas, universe }) {
            if (index < universe.objects.length) {
                canvas.context.save();
                let [shiftx, shifty] = universe.objects[index].position;
                canvas.context.translate(-shiftx, -shifty);
                render({ canvas, universe });
                canvas.context.restore();
            }
        }
    }
}

export function centerOnPoint({ point: [shiftx, shifty] }: {
    point: Vector,
}): RenderTransform {
    return function transform(render) {
        return function ({ canvas, universe }) {
            canvas.context.save();
            canvas.context.translate(-shiftx, -shifty);
            render({ canvas, universe });
            canvas.context.restore();
        }
    }
}

export function centerOnMidpoint(): RenderTransform {
    function calcMidpoint(objects: UniverseObject[]) {
        let { position, mass } = objects.reduce(
            (res, curr) => ({
                position: vector.add(res.position, vector.mults(curr.position, curr.mass)),
                mass: res.mass + curr.mass,
            }),
            { position: vector.zero(3), mass: 0 },
        );
        return vector.mults(position, 1 / mass);
    }
    return function transform(render) {
        return function ({ canvas, universe }) {
            let [shiftx, shifty] = calcMidpoint(universe.objects);
            canvas.context.save();
            canvas.context.translate(-shiftx, -shifty);
            render({ canvas, universe });
            canvas.context.restore();
        }
    }
}

export function drawObjects({ drawObject }: {
    drawObject: (props: { object: UniverseObject, canvas: Canvas }) => void,
}): RenderTransform {
    return function transform(render) {
        return function ({ canvas, universe }) {
            for (let object of universe.objects) {
                let { position: [x, y] } = object;
                canvas.context.save();
                canvas.context.translate(x, y);
                drawObject({ object, canvas });
                canvas.context.restore();
            }
            render({ canvas, universe });
        }
    }
}

export function drawObjectAsCircle({ lineWidth, fill, stroke }: {
    lineWidth: number,
    fill: Color,
    stroke: Color,
}) {
    return function ({ object, canvas: { context } }: {
        object: UniverseObject,
        canvas: Canvas,
    }) {
        context.lineWidth = lineWidth;
        context.fillStyle = fill;
        context.strokeStyle = stroke;
        context.beginPath();
        context.arc(0, 0, object.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
}

export function combineTransforms(...transforms: RenderTransform[]): RenderTransform {
    return function transform(render) {
        return transforms.reduceRight(
            (res, curr) => curr(res),
            render,
        );
    }
}

export const emptyRender: Render = () => { };

export function renderFromTransforms(...transforms: RenderTransform[]): Render {
    return combineTransforms(...transforms)(emptyRender);
}