import {
    clearFrame, Dimensions, layoutText, renderPositionedElement, Scene, TextLayout,
} from '@/sketcher';

// Reference: https://www.stedelijk.nl/en/collection/31791-josje-pollmann-wim-crouwel-zeven-grafici-uit-joegoslavie

export function sm(): Scene {
    return {
        state: undefined,
        layers: [{
            prepare({ canvas }) {
                clearFrame({ canvas, color: [220, 63, 66] });
            }
        }, {
            prepare({ canvas }) {
                let root = posterLayout({ width: canvas.width, height: canvas.height });
                let layout = layoutText({ canvas, root });

                // Calculate box
                let small = layout.find(p => p.element.id === 'small-text')!;
                let left = layout.find(p => p.element.id === 'left-letter')!;
                let right = layout.find(p => p.element.id === 'right-letter')!;
                let delta = .07;
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
        }],
    };
}

function posterLayout({ height }: Dimensions): TextLayout {
    let unit = height / 100;
    let font = {
        font: `bold ${34.5 * unit}pt sans-serif`,
        color: 'white',
    };
    return {
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
                content: [{
                    content: [{
                        id: 'left-letter',
                        text: 'S',
                        ...font,
                        offset: .13,
                    },
                    {
                        id: 'right-letter',
                        text: 'M',
                        ...font,
                    }]
                }],
            },
        ],
    };
}