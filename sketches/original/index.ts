import { SketchCollection } from "@/sketcher"
import { knot } from "./knot"
import { pastel } from "./pastel"
import { rainbowStrings } from "./rainbowStrings"
import { slinky } from "./slinky"
import { strokedSlinky } from "./strokedSlinky"
import { balanced } from "./balanced"

export const original: SketchCollection = {
    id: 'original',
    meta: {
        title: 'Первая серия / The First One',
    },
    sketches: [
        knot(),
        balanced(),
        pastel(),
        rainbowStrings(),
        slinky(),
        strokedSlinky(),
    ],
}