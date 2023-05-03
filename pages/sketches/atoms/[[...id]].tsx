import { sketchCollectionPager } from "@/components/pagers"
import { atoms } from "@/sketches/atoms"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollectionPager({
    collection: atoms,
    path: href('sketch', { collection: 'atoms' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page