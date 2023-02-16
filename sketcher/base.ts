export type Vector = number[];
export type Color = string;
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
// TODO: rename Canvas ?
export type Canvas = {
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
};
export type RenderProps = {
    canvas: Canvas,
    universe: Universe,
};
export type Render = (props: RenderProps) => void;
export type Scene = {
    universe: Universe,
    animator: Animator,
    renderFrame: Render,
    setupFrame?: Render,
};