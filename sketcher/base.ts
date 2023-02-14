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