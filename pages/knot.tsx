import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { knot } from "@/sketches/knot";

// @refresh reset

export default function KnotSketch() {
    let { node } = useSketcher({
        scene: knot(),
        period: 40,
    });
    return <PosterPage title="Knot" description="Knot sketch">
        <div>
            {node}
        </div>
    </PosterPage>;
}