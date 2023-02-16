// 'use client';

import { Canvas } from "@/components/Canvas";
import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { toRGBA } from "@/sketcher/color";
import knot from "@/sketches/knot";

function KnotComp() {
    let { renderFrame, setupFrame } = useSketcher({
        scene: knot({
            count: 8,
            velocityAmp: 0.5,
            radiusRange: { min: 0.5, max: 5 },
            palette: {
                main: toRGBA('orange'),
                complimentary: { red: 230, green: 230, blue: 230 },
            },
            variant: 'gradient',
        }),
        period: 40,
    });
    return <Canvas
        renderFrame={renderFrame}
        setup={setupFrame}
        animated={true}
    />
}

export default function KnotSketch() {
    return <PosterPage title="Knot" description="Knot sketch">
        <KnotComp />
    </PosterPage>;
}