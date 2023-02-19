import { RenderTransform } from "./transform";

export type Vector2d = [number, number];
export type Vector = [number, number, number];
export type NumRange = { min: number, max: number };

export type Box = {
    start: Vector,
    end: Vector,
};

export type StringColor = string;
export type RGBAColor = {
    red?: number,
    green?: number,
    blue?: number,
    alpha?: number,
};
export type Color = StringColor;

export type WithPosition = { position: Vector };
export type WithVelocity = { velocity: Vector };
export type WithMass = { mass: number };
export type WithRadius = { radius: number };
export type WithObjects<T> = { objects: T[] };

export type Animator<State> = (state: State) => State;
export type Canvas2DContext = CanvasRenderingContext2D;
export type Canvas = {
    context: Canvas2DContext,
    width: number,
    height: number,
};
export type RenderProps<State> = {
    canvas: Canvas,
    state: State,
};
export type Render<State> = (props: RenderProps<State>) => void;
export type Layer<State> = {
    render: Render<State>,
    transforms?: RenderTransform<State>[],
    static?: boolean,
    hidden?: boolean,
}
export type Scene<State> = {
    state: State,
    animator: Animator<State>,
    layers: Layer<State>[],
};