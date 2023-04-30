import { sketchCollection } from "@/components/collection";
import { wipSketches } from "@/sketches/wip";
import { href } from "@/utils/refs";

export let { getStaticPaths, getStaticProps, SketchPage } = sketchCollection({
    collection: wipSketches,
    path: href('sketch', { collection: 'wip' }),
});
export default SketchPage;