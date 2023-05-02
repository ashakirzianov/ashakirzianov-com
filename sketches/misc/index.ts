import { SketchCollection } from "@/sketcher"
import { number34 } from "./number34"
import { rave } from "./rave"
import { typography } from "./typography"

export const misc: SketchCollection = {
    id: 'misc',
    meta: {
        title: '...',
    },
    sketches: {
        'thirty-four': number34(),
        'rave': rave(),
        'typography': typography(),
    },
}