import { SketchCollection } from "@/sketcher"
import { bubbles } from "./bubbles"
import { bubblesFlat } from "./bubblesFlat"
import { molecules } from "./molecules"

export const atoms: SketchCollection = {
    id: 'atoms',
    meta: {
        title: 'Атомы / Atoms',
    },
    sketches: [
        bubbles(),
        bubblesFlat(),
        molecules(),
    ],
}