import { RenderTransform } from "./transform";

export type Vector = number[];
export type StringColor = string;
export type RGBAColor = {
    red: number,
    green: number,
    blue: number,
    alpha?: number,
};
export type Color = StringColor;
// TODO: remove ?
export type NumRange = { min: number, max: number };
// TODO: remove ?
export type Dimensions = {
    x: NumRange, y: NumRange, z: NumRange,
};
export type StateObject = {
    position: Vector,
    velocity: Vector,
    mass: number,
    radius: number,
};
export type StateType = {
    dimensions: Dimensions,
    objects: StateObject[],
};
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