import { Scene } from "./scene";

export type SketchMeta = {
    title: string,
    description?: string,
}
export type Sketches = {
    [id: string]: Scene<any>,
}
export type SketchCollection = {
    meta: SketchMeta,
    sketches: Sketches,
}