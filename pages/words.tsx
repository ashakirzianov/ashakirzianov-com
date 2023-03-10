import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { words } from "@/sketches/posters";

// @refresh reset

export default function Playground() {
    let { node } = useSketcher({
        scene: words(),
        period: 40,
    });
    return <PosterPage title="Words" description="Silly rotation">
        <div>
            {node}
        </div>
    </PosterPage>;
}