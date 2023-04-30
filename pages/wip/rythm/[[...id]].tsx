import { sketchCollection } from "@/components/collection";
import { rythm } from "@/sketches/rythm";

export let { getStaticPaths, getStaticProps, SketchPage } = sketchCollection({
    collection: rythm,
    // TODO: use 'href'
    path: '/wip/rythm'
});
export default SketchPage;