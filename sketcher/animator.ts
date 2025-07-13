import { NumRange } from './range'
import { SketcherCanvas } from './render'

export type AnimatorContext = {
    frame: number,
    getCanvas: (n: number) => SketcherCanvas<unknown> | undefined,
}
export type Animator<State> = (state: State, context: AnimatorContext) => State

export type CombineAnimatorsObject<State> = {
    [k in keyof State]: Animator<State[k]>;
}
export function combineAnimators<State>(object: CombineAnimatorsObject<State>): Animator<State> {
    return function (state, context) {
        const next = Object.entries(object).reduce(
            (s, [key, value]) => {
                const animator = value as Animator<any>
                const curr = s as any
                curr[key] = animator(curr[key], context)
                return s
            },
            { ...state },
        )
        return next
    }
}

export function reduceAnimators<State>(...animators: Animator<State>[]): Animator<State> {
    return function reduced(state, context) {
        return animators.reduce(
            (s, law) => law(s, context),
            state,
        )
    }
}

export function arrayAnimator<State>(animator: Animator<State>): Animator<State[]> {
    return function (state, context) {
        return state.map(s => animator(s, context))
    }
}

type AlternateAnimatorsObject<S> = {
    duration: number,
    animator: Animator<S>,
}
export function alternateAnimators<State>(animators: AlternateAnimatorsObject<State>[]): Animator<State> {
    const total = animators.reduce((r, a) => r + a.duration, 0)
    return function alternate(state, context) {
        const target = context.frame % total
        let current = 0
        for (const { duration, animator } of animators) {
            current += duration
            if (current > target) {
                return animator(state, context)
            }
        }
        return state
    }
}

export type WithTrace<State> = {
    trace: {
        [k in keyof State]?: Array<State[k]>;
    },
}
export function traceAnimator<O extends WithTrace<O>, K extends keyof O>(key: K, length: number): Animator<O> {
    return function trace(state) {
        const value = state[key]
        const current = [...(state.trace[key] ?? []), value]
        if (current.length > length) {
            current.shift()
        }
        return {
            ...state,
            trace: {
                ...state.trace,
                [key]: current,
            },
        }
    }
}

export function counter(range?: Partial<NumRange>): Animator<number> {
    const min = range?.min ?? 0
    const max = range?.max ?? Number.MAX_SAFE_INTEGER
    return c => c < max ? c + 1 : min
}