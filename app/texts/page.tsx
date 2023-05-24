import { AllStoritesPage } from "@/components/Pages"
import { getAllPreviews } from "@/utils/text"

export default async function AllStorites() {
    let previews = await getAllPreviews('ru')
    return <AllStoritesPage previews={previews} />
}