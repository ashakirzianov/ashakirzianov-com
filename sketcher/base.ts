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
export type UniverseObject = {
    position: Vector,
    velocity: Vector,
    mass: number,
    radius: number,
};
export type Universe = {
    dimensions: Dimensions,
    objects: UniverseObject[],
};
export type Animator = (universe: Universe) => Universe;
export type Canvas2DContext = CanvasRenderingContext2D;
export type Canvas = {
    context: Canvas2DContext,
    width: number,
    height: number,
};
export type RenderProps = {
    canvas: Canvas,
    universe: Universe,
};
export type Render = (props: RenderProps) => void;
export type Layer = {
    render: Render,
    transforms?: RenderTransform[],
    static?: boolean,
    hidden?: boolean,
}
export type Scene = {
    universe: Universe,
    animator: Animator,
    dimensions: {
        width: number,
        height: number,
    },
    layers: Layer[],
};