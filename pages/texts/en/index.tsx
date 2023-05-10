import { AllStoritesPage } from "@/components/Pages"
import { TextPostMap, getAllPreviews } from "@/utils/text"
import { GetStaticProps } from "next"

type Props = {
    previews: TextPostMap,
};
export const getStaticProps: GetStaticProps<Props> = async function () {
    let previews = await getAllPreviews('en')
    return {
        props: {
            previews,
        }
    }
}

export default function AllStorites({ previews }: Props) {
    return <AllStoritesPage previews={previews} />
}