import { sketchCollection } from "@/components/collection";
import { rytmVariations } from "@/sketches/wip/rythm";

export let { getStaticProps, getStaticPaths, SketchPage } = sketchCollection({
    variations: rytmVariations,
    path: '/wip/rythm',
});

export default SketchPage;