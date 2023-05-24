'use client'
import { AllSketchesPage } from "@/components/Pages"
import { atoms } from "@/sketches/atoms"
import { misc } from "@/sketches/misc"
import { posters } from "@/sketches/posters"
import { rythm } from "@/sketches/rythm"

export default function AllSketches() {
    return <AllSketchesPage collections={[
        rythm,
        atoms,
        posters,
        misc,
    ]} />
};