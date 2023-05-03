import { sketchCollection } from "@/components/collection"
import { rythm } from "@/sketches/rythm"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: rythm,
    path: href('sketch', { collection: 'rythm' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page