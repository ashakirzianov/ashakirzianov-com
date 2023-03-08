import {
    clearFrame, renderTextLayout, Scene, TextLayout,
} from '@/sketcher';

export function current() {
    return helloWorld();
}

type PlaygroundState = {};
function helloWorld(): Scene<PlaygroundState> {
    return {
        state: {},
        layers: [{}, {
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
                                    // border: 'yellow',
                                },
                            ],
                        }
                    ],
                };
                canvas.context.lineWidth = 5;
                renderTextLayout({
                    canvas, root, style: {
                        font: '10vh serif',
                        color: 'red',
                    }
                });
            },
        }],
    };
}