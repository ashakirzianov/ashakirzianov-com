import {
    rainbow, clearFrame, gray, multRGBA, Color, modItem, hueRange,
    pulsating, makeStops, fromRGBA, Scene, combineScenes, fromLayers, colorLayer,
} from '@/sketcher';
import {
    bubbles, bubblesFlat, fittedRainbow, molecules, original,
    pastelRainbows, rainbowSpring, rainbowStrings,
    randomBatches, strokedRainbows,
} from './organisms';

export const variations = [
    combineScenes(
        fromLayers(colorLayer('black')),
        molecules(),
    ),
    combineScenes(
        fromLayers(colorLayer('black')),
        bubbles(),
    ),
    combineScenes(
        fromLayers(colorLayer('black')),
        bubblesFlat(),
    ),
    combineScenes(
        fromLayers(colorLayer('black')),
        fittedRainbow(),
    ),
    combineScenes(
        fromLayers(colorLayer('black')),
        strokedRainbows(),
    ),
    function () {
        let back = rainbow({ count: 120, s: 40, l: 70 });
        return combineScenes(
            fromLayers({
                render({ canvas, frame }) {
                    clearFrame({
                        canvas,
                        color: modItem(back, frame),
                    });
                },
            }),
            pastelRainbows(),
        )
    }(),
    function () {
        let back = pulsating(hueRange({
            from: 0, to: 360, count: 200,
            s: 50, l: 90,
        }));
        return combineScenes(
            fromLayers({
                render({ canvas, frame }) {
                    clearFrame({
                        canvas,
                        color: modItem(back, frame),
                    });
                },
            }),
            rainbowSpring(),
        )
    }(),
    function () {
        let back = pulsating(hueRange({
            from: 0, to: 360, count: 200,
            s: 50, l: 90,
        }));
        return combineScenes(
            fromLayers({
                render({ canvas, frame }) {
                    clearFrame({
                        canvas,
                        color: modItem(back, frame),
                    });
                },
            }),
            rainbowStrings(),
        )
    }(),
    combineScenes(
        fromLayers(colorLayer(gray(230))),
        randomBatches(),
    ),
    combineScenes(
        fromLayers(colorLayer({
            kind: 'gradient',
            start: [0, 0], end: [0, 1],
            stops: makeStops({
                0: fromRGBA({ r: 230, g: 230, b: 230 }),
                0.7: fromRGBA(multRGBA({ r: 230, g: 230, b: 230 }, 1.2)),
                1: gray(50),
            }),
        })),
        original(),
    ),
];

export function current() {
    return combineScenes(
        fromLayers(colorLayer('black')),
        molecules(),
    );
}