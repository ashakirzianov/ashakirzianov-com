import { SketchCollection } from "@/sketcher"
import { loveMeTwoTimes } from "./loveMeTwoTimes"
import { alina } from "./alina"
import { bwway } from "./bwway"
import { helloWorld } from "./helloWorld"
import { styleIsTheAnswer } from "./sita"
import { pink } from "./pink"

export const posters: SketchCollection = {
    id: 'posters',
    meta: {
        title: 'Плакаты / Posters',
    },
    sketches: [
        loveMeTwoTimes(),
        bwway(),
        helloWorld(),
    ],
}

export const postersWip: SketchCollection = {
    id: 'posters',
    meta: {
        title: 'Unfinished Posters',
    },
    sketches: [
        styleIsTheAnswer(),
        pink(),
    ],
}