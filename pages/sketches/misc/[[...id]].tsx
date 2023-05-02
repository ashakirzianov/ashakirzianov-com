import { sketchCollection } from "@/components/collection";
import { misc } from "@/sketches/misc";
import { href } from "@/utils/refs";

export let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: misc,
    path: href('sketch', { collection: 'misc' }),
});
export default Page;