import { Scene } from "./scene"

export type SketchMeta = {
    title: string,
    description?: string,
}
export type Sketches = {
    [id: string]: Scene<any>,
}

export type SketchCollection<K extends string = string> = {
    id: string,
    meta: SketchMeta,
    sketches: {
        [id in K]: Scene<any>;
    },
    order?: K[],
}

export function collection<K extends string>(c: SketchCollection<K>) {
    return c
}