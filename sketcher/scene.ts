import { Animator } from "./animator";
import { Layer } from "./layer";
import { Dimensions } from "./layout";

export type Scene<State = unknown> = {
    state: State,
    layers: Layer<State>[],
    dimensions?: Dimensions,
    animator?: Animator<State>,
};

export function scene<T>(scene: Scene<T>): Scene<T> {
    return scene;
}

export function sceneDimensions(dimensions: Dimensions): Scene {
    return {
        state: null,
        layers: [],
        dimensions,
    };
}

export function combineScenes(...scenes: Scene<any>[]): Scene {
    let result: Scene<unknown[]> = {
        state: scenes.map(s => s.state),
        animator(states: any[], frame) {
            return states.map((state, idx) => {
                let animator = scenes[idx]?.animator;
                return animator ? animator(state, frame) : state;
            });
        },
        dimensions: scenes.reduce<Dimensions | undefined>(
            (prev, curr) => {
                if (curr.dimensions && prev !== undefined) {
                    return {
                        width: Math.max(curr.dimensions.width, prev.width),
                        height: Math.max(curr.dimensions.height, prev.height),
                    };
                } else if (curr.dimensions) {
                    return curr.dimensions;
                } else {
                    return prev;
                }
            },
            undefined,
        ),
        layers: scenes.map((scene, idx) => {
            return scene.layers.map((layer): Layer<unknown[]> => {
                return {
                    hidden: layer.hidden,
                    prepare({ canvas, frame, state }) {
                        if (layer.prepare) {
                            layer.prepare({
                                canvas, frame,
                                state: state[idx]!,
                            });
                        }
                    },
                    render({ canvas, frame, state }) {
                        if (layer.render) {
                            layer.render({
                                canvas, frame,
                                state: state[idx]!,
                            });
                        }
                    },
                };
            });
        }).flat(),
    };
    return result as Scene;
}

export function fromLayers(...layers: Layer<unknown>[]): Scene<unknown> {
    return {
        state: undefined,
        layers,
    };
}