import {
    rainbow, clearFrame, gray, multRGBA, Color, modItem, hueRange,
    pulsating, makeStops, fromRGBA, Scene, combineScenes, fromLayers,
} from '@/sketcher';
import {
    bubbles, bubblesFlat, fittedRainbow, molecules, original,
    pastelRainbows, rainbowSpring, rainbowStrings,
    randomBatches, strokedRainbows,
} from './organisms';

// TODO: fix typing
export const variations: any[] = [
    withBackground(molecules(), 'black'),
    withBackground(bubbles(), 'black'),
    withBackground(bubblesFlat(), 'black'),
    withBackground(fittedRainbow(), 'black'),
    withBackground(strokedRainbows(), 'black'),
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
    withBackground(randomBatches(), gray(230)),
    withBackground(original(), {
        kind: 'gradient',
        start: [0, 0], end: [0, 1],
        stops: makeStops({
            0: fromRGBA({ r: 230, g: 230, b: 230 }),
            0.7: fromRGBA(multRGBA({ r: 230, g: 230, b: 230 }, 1.2)),
            1: gray(50),
        }),
    }),
];

export function current() {
    return withBackground(molecules(), 'black');
}

function withBackground(scene: Scene<any>, color: Color) {
    return combineScenes(
        fromLayers({
            prepare({ canvas }) {
                clearFrame({ canvas, color });
            }
        }),
        scene,
    );
}