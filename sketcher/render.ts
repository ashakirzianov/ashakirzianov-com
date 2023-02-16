import {
    Color, Render, UniverseObject, Vector,
} from "./base";
import { rangeLength } from "./utils";
import vector from "./vector";

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
        return function ({ canvas, universe }) {
            let uwidth = rangeLength(universe.dimensions.x);
            let uheight = rangeLength(universe.dimensions.y);
            let xratio = canvas.width / uwidth;
            let yratio = canvas.height / uheight;
            let ratio = Math.min(xratio, yratio);
            let shiftx = (canvas.width - uwidth * ratio) / 2;
            let shifty = (canvas.height - uheight * ratio) / 2;
            canvas.context.save();
            canvas.context.translate(
                shiftx, shifty,
            );
            canvas.context.scale(ratio, ratio);
            canvas.context.translate(
                - universe.dimensions.x.min,
                - universe.dimensions.y.min,
            );
            render({ canvas, universe });
            canvas.context.restore();
        }
    }
}

export function zoomToFill(): RenderTransform {
    return function zoomToFitTransform(render) {
        return function ({ canvas, universe }) {
            let uwidth = rangeLength(universe.dimensions.x);
            let uheight = rangeLength(universe.dimensions.y);
            let xratio = canvas.width / uwidth;
            let yratio = canvas.height / uheight;
            let ratio = Math.max(xratio, yratio);
            let shiftx = (canvas.width - uwidth * ratio) / 2;
            let shifty = (canvas.height - uheight * ratio) / 2;
            canvas.context.save();
            canvas.context.translate(
                shiftx, shifty,
            );
            canvas.context.scale(ratio, ratio);
            canvas.context.translate(
                - universe.dimensions.x.min,
                - universe.dimensions.y.min,
            );
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