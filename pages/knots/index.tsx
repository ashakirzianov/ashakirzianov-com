import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { current } from "@/sketches/knots";

// @refresh reset

export default function Knots() {
    let { node } = useSketcher({
        scene: current(),
        period: 40,
        chunk: 500,
        // skip: 500,
    });
    return <PosterPage title="Knots" description="Knots series">
        <div>
            {node}
        </div>
    </PosterPage>;
}