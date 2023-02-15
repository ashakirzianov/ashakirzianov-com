// 'use client';

import { Canvas } from "@/components/Canvas";
import { Card } from "@/components/Card";
import { Poster } from "@/components/Poster";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import knot from "@/sketches/knot";
import Head from "next/head";

function KnotComp() {
    let { renderFrame } = useSketcher({
        sketch: knot({
            count: 8,
            velocityAmp: 0.5,
            radiusRange: { min: 0.5, max: 5 },
            color: 'orange',
        }),
        period: 40,
    });
    return <Canvas
        renderFrame={renderFrame}
        animated={true}
    />
}

export default function KnotSketch() {
    return <PosterPage title="Knot" description="Knot sketch">
        <KnotComp />
    </PosterPage>;
}