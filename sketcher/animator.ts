import { NumRange } from "./range";
import { Canvas } from "./render";

export type AnimatorContext = {
    frame: number,
    getCanvas: (n: number) => Canvas | undefined,
};
export type Animator<State> = (state: State, context: AnimatorContext) => State;

export type CombineAnimatorsObject<State> = {
    [k in keyof State]: Animator<State[k]>;
};
export function combineAnimators<State>(object: CombineAnimatorsObject<State>): Animator<State> {
    return function (state, context) {
        let next = Object.entries(object).reduce(
            (s, [key, value]) => {
                let animator = value as Animator<any>;
                let curr = s as any;
                curr[key] = animator(curr[key], context);
                return s;
            },
            { ...state },
        );
        return next;
    };
}

export function reduceAnimators<State>(...animators: Animator<State>[]): Animator<State> {
    return function reduced(state, context) {
        return animators.reduce(
            (s, law) => law(s, context),
            state,
        );
    };
}

export function arrayAnimator<State>(animator: Animator<State>): Animator<State[]> {
    return function (state, context) {
        return state.map(s => animator(s, context));
    }
}

type AlternateAnimatorsObject<S> = {
    duration: number,
    animator: Animator<S>,
};
export function alternateAnimators<State>(animators: AlternateAnimatorsObject<State>[]): Animator<State> {
    let total = animators.reduce((r, a) => r + a.duration, 0);
    return function alternate(state, context) {
        let target = context.frame % total;
        let current = 0;
        for (let { duration, animator } of animators) {
            current += duration;
            if (current > target) {
                return animator(state, context);
            }
        }
        return state;
    };
}

export type WithTrace<State> = {
    trace: {
        [k in keyof State]?: Array<State[k]>;
    },
}
export function traceAnimator<O extends WithTrace<O>, K extends keyof O>(key: K, length: number): Animator<O> {
    return function trace(state) {
        let value = state[key];
        let current = [...(state.trace[key] ?? []), value];
        if (current.length > length) {
            current.shift();
        }
        return {
            ...state,
            trace: {
                ...state.trace,
                [key]: current,
            },
        };
    }
}

export function counter(range?: Partial<NumRange>): Animator<number> {
    let min = range?.min ?? 0;
    let max = range?.max ?? Number.MAX_SAFE_INTEGER;
    return c => c < max ? c + 1 : min;
}