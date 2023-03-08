import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { current } from "@/sketches/words";

// @refresh reset

export default function Playground() {
    let { node } = useSketcher({
        scene: current(),
        period: 40,
    });
    return <PosterPage title="Words" description="Silly rotation">
        <div>
            {node}
        </div>
    </PosterPage>;
}