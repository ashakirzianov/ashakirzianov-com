import {
    clearFrame, colorLayer, combineScenes, Dimensions, fromLayers, layoutOnCanvas, renderMask, renderPositionedElement, Scene, TextLayout,
} from '@/sketcher';
import { pastelSlinky } from './organisms';

export function playground() {
    return combineScenes(
        fromLayers(colorLayer('white')),
        pastelSlinky(),
        poster(),
    );
}

export function poster(): Scene {
    return {
        state: undefined,
        layers: [{
            prepare({ canvas }) {
                let root = posterLayout({ ...canvas });
                let layout = layoutOnCanvas(canvas, root);

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!;
                let large = layout.find(p => p.element.id === 'large-text')!;
                let delta = .0;
                let rightX = large.position.left + large.dimensions.width * (1 - delta);
                let leftX = large.position.left + large.dimensions.width * delta;
                let side = rightX - leftX;
                let bottomY = small.position.top + small.dimensions.height;
                let x = leftX;
                let y = bottomY - side;


                clearFrame({ canvas, color: 'pink' });
                renderMask(canvas.context, context => {
                    context.fillRect(x, y, side, side);
                });

                for (let positioned of layout) {
                    renderPositionedElement({ canvas, positioned });
                }
            },
        }],
    };
}

function posterLayout({ height }: Dimensions): TextLayout {
    let unit = height / 100;
    let font = {
        font: `bold ${unit * 20}pt sans-serif`,
        color: 'white',
    };
    return {
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
                    // left: 0.02,
                },
                content: [{
                    id: 'small-text',
                    text: 'Gentlest of all colors',
                    fontSize: [unit * 1, 'pt'],
                    color: 'black',
                    rotation: -Math.PI / 2
                }],
            },
            {
                justify: 'center',
                crossJustify: 'end',
                // grow: 1,
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
    };
}