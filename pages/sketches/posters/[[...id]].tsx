import { sketchCollection } from "@/components/collection"
import { posters } from "@/sketches/posters"
import { href } from "@/utils/refs"

let { getStaticPaths, getStaticProps, Page } = sketchCollection({
    collection: posters,
    path: href('sketch', { collection: 'posters' }),
})
export {
    getStaticPaths, getStaticProps
}
export default Page