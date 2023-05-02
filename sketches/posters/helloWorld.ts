import {
    clearFrame, fromLayers, layoutAndRender, TextLayout,
} from '@/sketcher';

export function helloWorld() {
    return fromLayers({}, {
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