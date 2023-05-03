import { sketchCollectionPager } from "@/components/pagers"
import { posters } from "@/sketches/posters"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollectionPager({
    collection: posters,
    path: href('sketch', { collection: 'posters' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page