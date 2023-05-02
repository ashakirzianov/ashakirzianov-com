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
    sketches: {
        'love-me-two-times': loveMeTwoTimes(),
        'beautiful-wold-where-are-you': bwway(),
        'hello-world': helloWorld(),
    },
}

export const postersWip: SketchCollection = {
    id: 'posters',
    meta: {
        title: 'Unfinished Posters',
    },
    sketches: {
        'style-is-the-answer': styleIsTheAnswer(),
        'pink': pink(),
    },
}