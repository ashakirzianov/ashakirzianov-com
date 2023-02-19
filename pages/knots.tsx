import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { knots } from "@/sketches/knots";

// @refresh reset

export default function Knots() {
    let { node } = useSketcher({
        scene: knots({
            setCount: 5,
            count: 20,
            velocityAmp: 1,
            boxSize: 250,
            subBoxSize: 10,
            radiusRange: { min: 0.5, max: 17 },
            colors: [
                '#F5EAEA', '#FFB84C', '#F16767', '#A459D1',
            ],
            complimentary: [230, 230, 230],
        }),
        period: 40,
        chunk: 500,
    });
    return <PosterPage title="Knots" description="Knots series">
        <div>
            {node}
        </div>
    </PosterPage>;
}