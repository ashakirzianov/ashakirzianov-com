import { SketchCollection } from "@/sketcher"
import { number34 } from "./number34"
import { fourFlowers } from "./4flowers"
import { letters } from "./letters"

export const misc: SketchCollection = {
    id: 'misc',
    meta: {
        title: '...',
    },
    sketches: [
        number34(),
        fourFlowers(),
        letters(),
    ],
}