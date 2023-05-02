import { sketchCollection } from "@/components/collection"
import { posters } from "@/sketches/posters"
import { href } from "@/utils/refs"

export let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: posters,
    path: href('sketch', { collection: 'posters' }),
})
export default Page