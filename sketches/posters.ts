import {
    alternateAnimators,
    clearFrame, colorLayer, combineScenes, fromLayers, gray,
    layoutAndRender, layoutOnCanvas, renderLayer, renderMask, renderPositionedElement,
    renderPositionedLayout, scene, sceneDimensions, sidesTextLayout, staticLayer, TextLayout, TextStyle, vals,
} from '@/sketcher';
import {
    fittedRainbow, letters2, molecules, pastelSlinky, slinky,
} from './organisms';

export const variations: any[] = [
    pink(),
    sm(),
    helloWorld(),
    alina(),
    styleIsTheAnswer(),
    beautifulWorld(),
    loveMeTwoTimes(),
    // current(),
];

export function pink() {
    return combineScenes(
        fromLayers(colorLayer('white')),
        pastelSlinky(),
        fromLayers({
            prepare({ canvas }) {
                let font = {
                    fontSize: 20,
                    bold: true,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'end',
                    crossJustify: 'stretch',
                    padding: 2,
                    content: [
                        {

                            justify: 'start',
                            padding: {
                                top: 0,
                                bottom: 20,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Gentlest of all colors',
                                fontSize: 1,
                                color: 'black',
                                rotation: -Math.PI / 2
                            }],
                        },
                        {
                            justify: 'center',
                            crossJustify: 'end',
                            padding: {
                                bottom: 20,
                                top: 0,
                            },
                            content: [{
                                content: [{
                                    id: 'large-text',
                                    text: 'Pink',
                                    ...font,
                                }]
                            }],
                        },
                    ],
                });

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!;
                let large = layout.find(p => p.element.id === 'large-text')!;
                let side = large.dimensions.width;
                let x = large.position.left;
                let y = small.position.top + small.dimensions.height - side;

                clearFrame({ canvas, color: 'pink' });
                renderMask(canvas.context, context => {
                    context.fillRect(x, y, side, side);
                });

                for (let positioned of layout) {
                    renderPositionedElement({ canvas, positioned });
                }
            },
        }),
    );
}

export function sm() {
    // Reference: https://www.stedelijk.nl/en/collection/31791-josje-pollmann-wim-crouwel-zeven-grafici-uit-joegoslavie
    return fromLayers(
        colorLayer([220, 63, 66]),
        {
            prepare({ canvas }) {
                let font = {
                    fontSize: 34.5,
                    bold: true,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'end',
                    crossJustify: 'stretch',
                    content: [
                        {
                            justify: 'start',
                            padding: {
                                top: 0,
                                bottom: 20,
                                left: 2,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Zeven grafici uit Joegosiavië',
                                fontSize: .8,
                                color: 'black',
                                rotation: -Math.PI / 2,
                            }],
                        },
                        {
                            justify: 'end',
                            crossJustify: 'end',
                            padding: {
                                right: 2,
                                top: 0,
                                bottom: 3,
                            },
                            content: [{
                                content: [{
                                    id: 'left-letter',
                                    text: 'S',
                                    ...font,
                                    offset: -3,
                                    crossOffset: -2,
                                },
                                {
                                    id: 'right-letter',
                                    text: 'M',
                                    ...font,
                                }]
                            }],
                        },
                    ],
                });

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!;
                let left = layout.find(p => p.element.id === 'left-letter')!;
                let right = layout.find(p => p.element.id === 'right-letter')!;
                let delta = .0;
                let rightX = right.position.left + right.dimensions.width * (1 - delta);
                let leftX = left.position.left + left.dimensions.width * delta;
                let side = rightX - leftX;
                let bottomY = small.position.top + small.dimensions.height;
                let x = leftX;
                let y = bottomY - side;

                clearFrame({ canvas, color: [228, 101, 79] });
                canvas.context.clearRect(x, y, side, side);

                for (let positioned of layout) {
                    renderPositionedElement({ canvas, positioned });
                }
            },
        },
    );
}

export function helloWorld() {
    return fromLayers({/* TODO: why do we need this emply layer? */ }, {
        render({ canvas, frame }) {
            clearFrame({ canvas, color: 'black' });
            let root: TextLayout = {
                content: [
                    {
                        padding: .1,
                        grow: 1,
                        direction: 'column',
                        border: 'orange',
                        justify: 'start',
                        crossJustify: 'end',
                        content: [
                            {
                                text: 'hello',
                                color: 'yellow',
                                rotation: -frame * 0.2,
                            },
                            {
                                text: 'world',
                                border: 'red',
                            },
                        ],
                    },
                    {
                        grow: 0,
                        border: 'blue',
                        direction: 'column',
                        crossJustify: 'center',
                        content: [
                            {
                                grow: 3,
                                border: 'magenta',
                            },
                            {
                                text: 'Here we go',
                                border: 'green',
                                rotation: frame * 0.1,
                            },
                            {
                                grow: 1,
                            },
                        ],
                    }
                ],
            };
            canvas.context.lineWidth = 5;
            layoutAndRender({
                canvas, root, style: {
                    fontSize: 5,
                    fontFamily: 'serif',
                    color: 'red',
                }
            });
        },
    });
}

export function alina() {
    return combineScenes(
        fromLayers(colorLayer(gray(30))),
        slinky(),
        fromLayers({
            prepare({ canvas }) {
                let delta = 10;
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'space-evenly',
                    crossJustify: 'center',
                    content: vals(4, 'Alina').map((text, n) => ({
                        text,
                        fontSize: 16,
                        smallCaps: true,
                        italic: true,
                        bold: true,
                        color: 'white',
                        offset: -3 / 2 * delta + n * delta,
                    })),
                });

                clearFrame({ canvas, color: 'pink' });
                renderMask(canvas.context, context => {
                    for (let positioned of layout) {
                        renderPositionedElement({ canvas, positioned });
                    }
                });
            },
        }),
    );
}

export function styleIsTheAnswer() {
    return combineScenes(
        fromLayers(colorLayer('black')),
        molecules(),
        fromLayers({
            prepare({ canvas }) {
                let font = {
                    fontSize: 15,
                    smallCaps: true,
                    bold: true,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'space-between',
                    crossJustify: 'center',
                    padding: {
                        top: 30,
                    },
                    content: [{
                        text: 'Style',
                        ...font,
                    }, {
                        text: 'is the',
                        ...font,
                    }, {
                        text: 'answer',
                        ...font,
                    }],
                });

                clearFrame({ canvas, color: 'black' });
                renderMask(canvas.context, context => {
                    for (let positioned of layout) {
                        renderPositionedElement({ canvas, positioned });
                    }
                });
            },
        }),
    );
}

export function beautifulWorld() {
    let deg = 10;
    let duration = 20;
    let initialState = {
        cross: [0, -5, -33, -40, -35],
        main: [0, 0, 0, 0, 0],
    }
    return combineScenes(
        fromLayers(colorLayer('white')),
        fittedRainbow(),
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
                        padding: 0.02,
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

export function loveMeTwoTimes() {
    return combineScenes(
        fromLayers(colorLayer(gray(240))),
        letters2('Love me two times, baby'),
        fromLayers(staticLayer(({ canvas }) => {
            let style = {
                fontSize: 1,
                letterBox: {
                    padding: 15,
                    borderColor: 'black',
                    borderWidth: .1,
                },
                padding: {
                    // top: 15,
                },
            };
            let layout = layoutOnCanvas(canvas, {
                direction: 'column',
                justify: 'space-between',
                // crossJustify: 'start',
                padding: 10,
                content: [{
                    justify: 'center',
                    content: [{
                        // text: 'Los Angeles, California',
                        ...style,
                        letterBox: {},
                        // letterBox: undefined,
                    }],
                }, {
                    direction: 'column',
                    content: [{
                        text: 'The Doors',
                        ...style,
                    }, {
                        text: 'Lyrics by Jim Morrison',
                        ...style,
                    }, {
                        text: 'November 1967',
                        ...style,
                    }],
                }],
            });
            renderPositionedLayout({
                layout, canvas,
            });
        }))
    );
}

export function current() {
    return fromLayers(
        colorLayer('black'),
        staticLayer(({ canvas }) => {
            let layout = sidesTextLayout({
                texts: {
                    left: { text: 'Left', justify: 'center' },
                    top: {
                        text: 'Top',
                        color: 'red',
                        border: 'blue',
                    },
                    right: 'Right',
                    bottom: {
                        text: 'Bottom',
                        hidden: true,
                    },
                },
                style: {
                    fontSize: 10,
                    color: 'white',
                },
                padding: 1,
                inside: {
                    border: 'red',
                    grow: 1,
                },
                canvas,
            });
            renderPositionedLayout({
                canvas,
                layout,
            });
        }),
    );
}