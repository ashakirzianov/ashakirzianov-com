import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { variations } from "@/sketches/posters";

// @refresh reset

export default function Main() {
  let { node } = useSketcher({
    scene: variations[0]!,
    period: 40,
    chunk: 500,
  });
  return <PosterPage title="Anton's page" description="Anton Shakirzianov">
    <div>
      {node}
    </div>
  </PosterPage>;
}