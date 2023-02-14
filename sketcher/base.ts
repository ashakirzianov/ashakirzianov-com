export type Vector = number[];
export type Color = string;
export type NumRange = { min: number, max: number };
export type UniverseObject = {
    position: Vector,
    velocity: Vector,
    mass: number,
    radius: number,
};
export type Universe = {
    dimensions: { x: NumRange, y: NumRange, z: NumRange },
    objects: UniverseObject[],
};