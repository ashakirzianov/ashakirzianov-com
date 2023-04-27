import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/utils/sketcher";
import { colorLayer, fromLayers } from "@/sketcher";

// @refresh reset

export default function Playground() {
    let { node } = useSketcher({
        scene: playground(),
        period: 40,
        chunk: 500,
    });
    return <PosterPage title="Playground" description="Sketching playground">
        <div>
            {node}
        </div>
    </PosterPage>;
}

function playground() {
    return fromLayers(
        colorLayer([230, 230, 230]),
    );
}