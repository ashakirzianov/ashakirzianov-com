import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { playground } from "@/sketches/playground";

// @refresh reset

export default function Playground() {
    let { node } = useSketcher({
        scene: playground(),
        period: 40,
    });
    return <PosterPage title="Playground" description="Sketching playground">
        <div>
            {node}
        </div>
    </PosterPage>;
}