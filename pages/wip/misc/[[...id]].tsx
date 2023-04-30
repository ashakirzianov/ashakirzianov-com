import { sketchCollection } from "@/components/collection";
import { wipSketches } from "@/sketches/wip";

export let { getStaticPaths, getStaticProps, SketchPage } = sketchCollection({
    collection: wipSketches,
    // TODO: use 'href'
    path: '/wip/misc'
});
export default SketchPage;