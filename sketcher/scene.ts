import { Animator } from "./animator";
import { Layer } from "./layer";

export type Scene<State = unknown> = {
    state: State,
    animator?: Animator<State>,
    layers: Layer<State>[],
};

export function scene<T>(scene: Scene<T>): Scene<T> {
    return scene;
}

export function combineScenes(...scenes: Scene<any>[]): Scene {
    let result: Scene<unknown[]> = {
        state: scenes.map(s => s.state),
        animator(states: any[]) {
            return states.map((state, idx) => {
                let animator = scenes[idx]?.animator;
                return animator ? animator(state) : state;
            });
        },
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