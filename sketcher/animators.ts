import { Animator } from './base';

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
        console.log('curr', state);
        console.log('next', next);
        return next;
    };
}