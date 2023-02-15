// 'use client';

import { Canvas } from "@/components/Canvas";
import { Poster } from "@/components/Poster";
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
    return (
        <>
            <Head>
                <title>Knot</title>
                <meta name="description" content="Knot sketch" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <div className="sketch">
                    <Poster>
                        <KnotComp />
                    </Poster>
                </div>
                <style jsx>{`
                .sketch {
                    width: 100vw;
                    height: 100vh;
                }
                `}</style>
            </main>
        </>
    )
}