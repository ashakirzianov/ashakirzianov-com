import { sketchCollection } from "@/components/collection"
import { original } from "@/sketches/original"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: original,
    path: href('sketch', { collection: 'original' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page