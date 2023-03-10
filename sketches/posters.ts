import {
    clearFrame, colorLayer, combineScenes, Dimensions, fromLayers, layoutText, renderMask, renderPositionedElement, Scene, TextLayout,
} from '@/sketcher';
import { pastelRainbows } from './organisms';

export const variations = [
    pink(),
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