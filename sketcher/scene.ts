import { Animator } from "./animator"
import { Layer } from "./layer"
import { Dimensions } from "./layout"

export type SceneMeta = {
    dimensions?: [width: number, height: number],
    description?: string,
    title?: string,
}
export type Scene<State = unknown> = {
    state: State,
    layers: Layer<State>[],
    animator?: Animator<State>,
} & SceneMeta;

export function scene<T>(scene: Scene<T>): Scene<T> {
    return scene
}

export function sceneMeta(meta: SceneMeta): Scene {
    return {
        state: null,
        layers: [],
        ...meta,
    }
}

export function combineScenes(...scenes: Scene<any>[]): Scene {
    let result: Scene<unknown[]> = {
        state: scenes.map(s => s.state),
        animator(states: any[], frame) {
            return states.map((state, idx) => {
                let animator = scenes[idx]?.animator
                return animator ? animator(state, frame) : state
            })
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
                            })
                        }
                    },
                    render({ canvas, frame, state }) {
                        if (layer.render) {
                            layer.render({
                                canvas, frame,
                                state: state[idx]!,
                            })
                        }
                    },
                }
            })
        }).flat(),
        // Combine meta:
        dimensions: scenes.reduce<[number, number] | undefined>(
            (prev, curr) => {
                if (curr.dimensions && prev !== undefined) {
                    return [
                        Math.max(curr.dimensions[0], prev[0]),
                        Math.max(curr.dimensions[1], prev[1]),
                    ]
                } else if (curr.dimensions) {
                    return curr.dimensions
                } else {
                    return prev
                }
            },
            undefined,
        ),
        description: scenes
            .map(s => s.description)
            .filter(desc => desc)
            .join('\n'),
        title: scenes
            .map(s => s.title)
            .filter(title => title)
            .join(' '),
    }
    return result as Scene
}

export function fromLayers(...layers: Layer<unknown>[]): Scene<unknown> {
    return {
        state: undefined,
        layers,
    }
}