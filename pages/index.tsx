import { PosterPage } from "@/components/PosterPage";
import { useSketcher } from "@/hooks/sketcher";
import { loveMeTwoTimes } from "@/sketches/posters";

// @refresh reset

export default function Main() {
  let { node } = useSketcher({
    scene: loveMeTwoTimes(),
    period: 40,
    chunk: 500,
  });
  return <PosterPage title="Anton's page" description="Anton Shakirzianov">
    <div>
      {node}
    </div>
  </PosterPage>;
}