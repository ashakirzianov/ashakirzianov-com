import { sketchCollection } from "@/components/collection";
import { wip } from "@/sketches/wip";

export let { getStaticProps, getStaticPaths, SketchPage } = sketchCollection({
    variations: wip,
    path: '/wip/misc',
});

export default SketchPage;