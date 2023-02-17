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
export type NumRange = { min: number, max: number };
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
export type Animator = (state: StateType) => StateType;
export type Canvas2DContext = CanvasRenderingContext2D;
export type Canvas = {
    context: Canvas2DContext,
    width: number,
    height: number,
};
export type RenderProps = {
    canvas: Canvas,
    state: StateType,
};
export type Render = (props: RenderProps) => void;
export type Layer = {
    render: Render,
    transforms?: RenderTransform[],
    static?: boolean,
    hidden?: boolean,
}
export type Scene = {
    state: StateType,
    animator: Animator,
    layers: Layer[],
};