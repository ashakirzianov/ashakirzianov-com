import { SketchCollection } from "@/sketcher";
import { knot } from "./knot";
import { pastel } from "./pastel";
import { rainbowStrings } from "./rainbowStrings";
import { slinky } from "./slinky";
import { strokedSlinky } from "./strokedSlinky";

export const wipSketches: SketchCollection = {
    id: 'wip',
    meta: {
        title: 'Неоконченное / Unfinished',
    },
    sketches: {
        'knot': knot(),
        'pastel': pastel(),
        'rainbow-strings': rainbowStrings(),
        'slinky': slinky(),
        'stroked-slinky': strokedSlinky(),
    },
}