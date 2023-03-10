import {
    clearFrame, colorLayer, combineScenes, Dimensions, fromLayers, layoutText, renderMask, renderPositionedElement, Scene, TextLayout,
} from '@/sketcher';
import { pastelRainbows } from './organisms';

export const variations: any[] = [
    pink(),
    sm(),
];

export function pink() {
    return combineScenes(
        fromLayers(colorLayer('white')),
        pastelRainbows(),
        fromLayers({
            prepare({ canvas }) {
                let unit = canvas.height / 100;
                let font = {
                    font: `bold ${unit * 20}pt sans-serif`,
                    color: 'white',
                };
                let layout = layoutText({
                    canvas,
                    root: {
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
                    },
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

export function sm(): Scene {
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
                let layout = layoutText({
                    canvas,
                    root: {
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
                                    rotation: -Math.PI / 2
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
                    },
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