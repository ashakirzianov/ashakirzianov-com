// 'use client';

import { Canvas } from "@/components/Canvas";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import knot from "@/sketches/knot";

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
        setup={({ context, width, height }) => {
            context.save();
            var gradient = context.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, "#CCCCCC");
            gradient.addColorStop(0.2, "#DDDDDD");
            gradient.addColorStop(1, "#FFFFFF");

            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);
            context.restore();
        }}
        animated={true}
    />
}

export default function KnotSketch() {
    return <PosterPage title="Knot" description="Knot sketch">
        <KnotComp />
    </PosterPage>;
}