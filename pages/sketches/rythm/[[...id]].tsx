import { sketchCollectionPager } from "@/components/pagers"
import { rythm } from "@/sketches/rythm"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollectionPager({
    collection: rythm,
    path: href('sketch', { collection: 'rythm' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page