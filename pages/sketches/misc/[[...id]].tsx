import { sketchCollectionPager } from "@/components/pagers"
import { misc } from "@/sketches/misc"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollectionPager({
    collection: misc,
    path: href('sketch', { collection: 'misc' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page