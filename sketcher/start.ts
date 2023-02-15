import { Universe } from "./base";
import { Law } from "./laws";
import { Canvas, Render } from "./render";

export type StartUniverseProps = {
    universe: Universe,
    render: Render,
    setup?: Render,
    law: Law,
    period: number,
    skip?: number,
    canvas?: Canvas,
    background?: string,
};
export type StartUniverseOut = {
    renderFrame: (canvad: Canvas) => void,
    tick: () => void,
};
export function startUniverse({
    universe,
    render,
    law,
    canvas,
    background,
}: StartUniverseProps): StartUniverseOut {
    if (background && canvas) {
        canvas.context.save();
        canvas.context.fillStyle = background;
        canvas.context.fillRect(0, 0, canvas.width, canvas.height);
        canvas.context.restore();
    }

    function renderFrame(canvas: Canvas) {
        render({ canvas, universe });
    }
    function tick() {
        let next = law({ universe });
        universe = next.universe;
    }
    return { renderFrame, tick };
}