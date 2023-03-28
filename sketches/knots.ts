import {
    rainbow, clearFrame, gray, multRGBA, modItem,
    pulsating, makeStops, fromRGBA, combineScenes, fromLayers, colorLayer,
} from '@/sketcher';
import {
    bubbles, bubblesFlat, rave, molecules, knot,
    pastelCircles, slinky, rainbowStrings,
    balanced, strokedSlinky, letters, letters2,
} from './forms';

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
        rave(),
    ),
    combineScenes(
        fromLayers(colorLayer('black')),
        strokedSlinky(),
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
            pastelCircles(),
        )
    }(),
    function () {
        let back = pulsating(rainbow({
            count: 200, s: 50, l: 90,
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
            slinky(),
        )
    }(),
    function () {
        let back = pulsating(rainbow({
            count: 200, s: 50, l: 90,
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
        balanced(),
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
        knot(),
    ),
    combineScenes(
        fromLayers(colorLayer(gray(230))),
        letters('Love me two times, baby'),
    ),
    combineScenes(
        fromLayers(colorLayer(gray(230))),
        letters2('Love me two times, baby'),
    ),
];