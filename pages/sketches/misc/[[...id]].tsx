import { sketchCollection } from "@/components/collection"
import { misc } from "@/sketches/misc"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: misc,
    path: href('sketch', { collection: 'misc' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page