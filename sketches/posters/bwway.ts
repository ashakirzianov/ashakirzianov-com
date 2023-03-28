import {
    alternateAnimators, clearFrame, colorLayer, combineScenes, fromLayers,
    renderPositionedLayout, scene, sceneMeta, sidesTextLayout, TextLayout,
} from "@/sketcher";
import { rave } from "../forms";

export function bwway() {
    let deg = 10;
    let duration = 20;
    let initialState = {
        cross: [0, -5, -33, -40, -35],
        main: [0, 0, 0, 0, 0],
    }
    return combineScenes(
        sceneMeta({
            title: 'Beuatiful World, Where Are You',
            description: `Poster for Sally Rooney's book "Beautiful World, Where Are You`,
        }),
        fromLayers(colorLayer('white')),
        rave(),
        scene({
            state: initialState,
            animator: alternateAnimators([{
                duration,
                animator({ cross, main }) {
                    return {
                        cross: cross.map((c, i) => c - (c - initialState.cross[i]!) / 2),
                        main: main.map((c, i) => c - (c - initialState.main[i]!) / duration),
                    };
                },
            }, {
                duration: 1,
                animator: () => initialState,
            }, {
                duration: duration * 1.5,
                animator({ cross, main }) {
                    return {
                        cross: cross.map(c => c + (Math.random() - .5) * deg),
                        main: main.map(c => c + (Math.random() - .5) * deg),
                    };
                },
            }]),
            layers: [{
                render({ canvas, state: { cross, main } }) {
                    let inside: TextLayout = {
                        grow: 1,
                        direction: 'column',
                        justify: 'center',
                        crossJustify: 'end',
                        padding: {
                            top: 5,
                            right: 10,
                        },
                        content: ['Beautiful', 'world,', 'where', 'are', 'you?']
                            .map((text, n): TextLayout => ({
                                text,
                                fontSize: 10,
                                bold: true,
                                color: 'white',
                                crossOffset: cross[n]!,
                                offset: main[n]!,
                                compositeOperation: 'destination-out',
                            })),
                    };
                    let sides = sidesTextLayout({
                        canvas,
                        texts: {
                            top: {
                                text: 'Sally Rooney'.toUpperCase(),
                            },
                            right: [
                                'Author of'.toLowerCase(),
                                {
                                    text: ' Normal People'.toLowerCase(),
                                    bold: true, smallCaps: true, italic: true,
                                },
                            ],
                            left: [{
                                text: '#1 New Your Times Bestseller'.toLowerCase(),
                            }],
                            bottom: [{
                                text: 'Los Angeles | Venice | 2023'.toLowerCase(),
                            }],
                        },
                        padding: 1,
                        style: {
                            fontSize: 1,
                            bold: true,
                            smallCaps: true,
                            // color: 'violet',
                            color: [234, 113, 196],
                            useFontBoundingBox: true,
                        },
                        inside,
                    });

                    clearFrame({ canvas, color: 'black' });
                    renderPositionedLayout({
                        canvas,
                        layout: sides,
                    });
                }
            }]
        }),
    );
}