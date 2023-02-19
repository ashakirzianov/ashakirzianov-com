export type Animator<State> = (state: State) => State;

export type CombineAnimatorsObject<State> = {
    [k in keyof State]: Animator<State[k]>;
};
export function combineAnimators<State>(object: CombineAnimatorsObject<State>): Animator<State> {
    return function (state) {
        let next = Object.entries(object).reduce(
            (s, [key, value]) => {
                let animator = value as Animator<any>;
                let curr = s as any;
                curr[key] = animator(curr[key]);
                return s;
            },
            { ...state },
        );
        return next;
    };
}

export function reduceAnimators<State>(...animators: Animator<State>[]): Animator<State> {
    return function reduced(state) {
        return animators.reduce(
            (s, law) => law(s),
            state,
        );
    };
}

export function arrayAnimator<State>(animator: Animator<State>): Animator<State[]> {
    return function (state) {
        return state.map(animator);
    }
}