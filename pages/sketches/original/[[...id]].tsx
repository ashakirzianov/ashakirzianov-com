import { sketchCollectionPager } from "@/components/pagers"
import { original } from "@/sketches/original"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollectionPager({
    collection: original,
    path: href('sketch', { collection: 'original' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page