import {
    alternateAnimators,
    clearFrame, colorLayer, combineScenes, fromLayers, gray,
    layoutAndRender, layoutOnCanvas, renderLayer, renderMask, renderPositionedElement,
    renderPositionedLayout, scene, sidesTextLayout, staticLayer, TextLayout, vals,
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
                let unit = canvas.height / 100;
                let font = {
                    font: `bold ${unit * 20}pt sans-serif`,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'end',
                    crossJustify: 'stretch',
                    padding: .02,
                    content: [
                        {

                            justify: 'start',
                            padding: {
                                top: 0,
                                bottom: 0.2,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Gentlest of all colors',
                                font: `${unit * 1}pt sans-serif`,
                                color: 'black',
                                rotation: -Math.PI / 2
                            }],
                        },
                        {
                            justify: 'center',
                            crossJustify: 'end',
                            padding: {
                                bottom: 0.2,
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
                    renderPositionedElement({ context: canvas.context, positioned });
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
                let unit = canvas.height / 100;
                let font = {
                    font: `bold ${34.5 * unit}pt sans-serif`,
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
                                bottom: 0.2,
                                left: 0.02,
                            },
                            content: [{
                                id: 'small-text',
                                text: 'Zeven grafici uit Joegosiavië',
                                font: '2vh sans serif',
                                color: 'black',
                                rotation: -Math.PI / 2,
                            }],
                        },
                        {
                            justify: 'end',
                            crossJustify: 'end',
                            padding: {
                                right: .02,
                                top: 0,
                                bottom: .03,
                            },
                            content: [{
                                content: [{
                                    id: 'left-letter',
                                    text: 'S',
                                    ...font,
                                    offset: -.03,
                                    crossOffset: -.02,
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
                    renderPositionedElement({ context: canvas.context, positioned });
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
                    font: '10vh serif',
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
                let unit = canvas.height / 100;
                let delta = .1;
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'space-evenly',
                    crossJustify: 'center',
                    content: vals(4, 'Alina').map((text, n) => ({
                        text,
                        font: `small-caps italic bold ${unit * 16}pt sans-serif`,
                        color: 'white',
                        offset: -3 / 2 * delta + n * delta,
                    })),
                });

                clearFrame({ canvas, color: 'pink' });
                renderMask(canvas.context, context => {
                    for (let positioned of layout) {
                        renderPositionedElement({ context, positioned });
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
                let unit = canvas.height / 100;
                let font = {
                    font: `small-caps bold ${unit * 15}pt sans-serif`,
                    color: 'white',
                };
                let layout = layoutOnCanvas(canvas, {
                    grow: 1,
                    direction: 'column',
                    justify: 'space-between',
                    crossJustify: 'center',
                    padding: {
                        top: 0.3,
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
                        renderPositionedElement({ context, positioned });
                    }
                });
            },
        }),
    );
}

export function beautifulWorld() {
    let deg = 0.1;
    let duration = 20;
    let initialState = {
        cross: [0, -0.05, -0.33, -0.4, -0.35],
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
                    let unit = canvas.height / 100;
                    let inside: TextLayout = {
                        grow: 1,
                        direction: 'column',
                        justify: 'center',
                        crossJustify: 'end',
                        padding: {
                            top: .05,
                            right: .1,
                        },
                        content: ['Beautiful', 'world,', 'where', 'are', 'you?']
                            .map((text, n): TextLayout => ({
                                text,
                                font: `bold ${unit * 10}pt sans-serif`,
                                color: 'white',
                                crossOffset: cross[n]!,
                                offset: main[n]!,
                                // border: 'red',
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
                                    font: 'small-caps bold italic 3vh sans-serif',
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
                            font: 'bold small-caps 3vh sans-serif',
                            // color: 'violet',
                            color: [234, 113, 196],
                            useFontBoundingBox: true,
                        },
                        inside,
                    });

                    clearFrame({ canvas, color: 'black' });
                    renderPositionedLayout({
                        context: canvas.context,
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
                    font: '10vh sans-serif',
                    color: 'white',
                },
                padding: 0.01,
                inside: {
                    border: 'red',
                    grow: 1,
                },
                canvas,
            });
            renderPositionedLayout({
                context: canvas.context,
                layout,
            });
        }),
    );
}