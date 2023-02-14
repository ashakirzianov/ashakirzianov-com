import { Universe } from "./base";
import { Law } from "./laws";
import { Canvas, Render } from "./render";

export type StartUniverseProps = {
    universe: Universe,
    render: Render,
    law: Law,
    period: number,
    skip?: number,
    canvas?: Canvas,
    background?: string,
};
export function startUniverse({
    universe,
    render,
    law,
    period,
    skip,
    canvas,
    background,
}: StartUniverseProps) {
    let firstPeriod = period;
    if (skip) {
        let count = Math.floor(skip / period);
        for (let i = 0; i < count; i++) {
            if (canvas) {
                render({ canvas, universe });
            }
            let next = law({ universe });
            universe = next.universe;
        }
        firstPeriod = skip % period;
    }
    function loop() {
        let next = law({ universe });
        universe = next.universe;
        setTimeout(loop, period);
    }
    setTimeout(loop, firstPeriod);
    if (background && canvas) {
        canvas.context.save();
        canvas.context.fillStyle = background;
        canvas.context.fillRect(0, 0, canvas.width, canvas.height);
        canvas.context.restore();
    }

    function drawFrame(canvas: Canvas) {
        render({ canvas, universe });
    }
    return { drawFrame };
}