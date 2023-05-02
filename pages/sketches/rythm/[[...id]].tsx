import { sketchCollection } from "@/components/collection"
import { rythm } from "@/sketches/rythm"
import { href } from "@/utils/refs"

export let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: rythm,
    path: href('sketch', { collection: 'rythm' }),
})
export default Page