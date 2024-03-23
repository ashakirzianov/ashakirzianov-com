import { getPreviews } from "@/utils/text"
import { AllStoritesPage } from "./shared"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: 'Все рассказы',
    description: 'Страница со всеми рассказами',
})

export default async function AllStorites() {
    let previews = await getPreviews([
        'dummy',
        'start-wearing-purple',
        'april-fools',
        'apart',
        'thirty-four',
    ])
    return <AllStoritesPage previews={previews} />
}