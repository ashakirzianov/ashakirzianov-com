import {
    renderTextLayout, Scene, TextLayout,
} from '@/sketcher';

type PlaygroundState = {};
export function playground(): Scene<PlaygroundState> {
    let root: TextLayout = {
        border: 'white',
        content: [
            {
                grow: 1, direction: 'column', border: 'orange',
                justify: 'start',
                crossJustify: 'start',
                content: [{ text: 'hello', border: 'magenta' }],
            },
            // { text: 'hello', border: 'orange', grow: 1 },
            {
                grow: 1,
                border: 'blue',
                direction: 'column',
                content: [
                    { grow: 1, border: 'pink' },
                    { text: 'world', border: 'brown' },
                    { grow: 1, border: 'yellow' },
                ],
            }
        ],
    };

    return {
        state: {},
        layers: [{}, {
            prepare({ canvas }) {
                canvas.context.lineWidth = 5;
                renderTextLayout({
                    canvas, root, style: {
                        font: '120px serif',
                        color: 'red',
                    }
                });
            },
        }],
    };
}