import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { variations } from "@/sketches/posters";

// @refresh reset

export default function Knots() {
  let { node } = useSketcher({
    scene: variations[2]!,
    period: 40,
    chunk: 500,
  });
  return <PosterPage title="Knots" description="Knots series">
    <div>
      {node}
    </div>
  </PosterPage>;
}