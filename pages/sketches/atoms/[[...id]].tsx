import { sketchCollection } from "@/components/collection";
import { atoms } from "@/sketches/atoms";
import { href } from "@/utils/refs";

export let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: atoms,
    path: href('sketch', { collection: 'atoms' }),
});
export default Page;