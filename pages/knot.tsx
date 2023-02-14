import { Canvas } from "@/components/Canvas";
import { useSketcher } from "@/hooks/sketcher";
import knot from "@/sketches/knot";
import Head from "next/head";

function KnotComp() {
    let { renderFrame } = useSketcher(() => knot({
        count: 8,
        velocityAmp: 0.5,
        radiusRange: { min: 0.5, max: 5 },
        color: 'orange',
    }));
    return <Canvas
        renderFrame={renderFrame}
        animated={true}
        width={500}
        height={600}
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
                    <KnotComp />
                </div>
            </main>
        </>
    )
}