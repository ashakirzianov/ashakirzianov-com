import { sketchCollection } from "@/components/collection";
import { rythm } from "@/sketches/rythm";
import { href } from "@/utils/refs";

export let { getStaticPaths, getStaticProps, SketchPage } = sketchCollection({
    collection: rythm,
    path: href('sketch', { collection: 'rythm' }),
});
export default SketchPage;