import { getAllPreviews } from "@/utils/text"
import { AllStoritesPage } from "./shared"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: 'Все рассказы',
    description: 'Страница со всеми рассказами',
})

export default async function AllStorites() {
    let previews = await getAllPreviews('ru')
    return <AllStoritesPage previews={previews} />
}