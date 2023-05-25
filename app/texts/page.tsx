import { getAllPreviews } from "@/utils/text"
import { AllStoritesPage } from "./shared"

export default async function AllStorites() {
    let previews = await getAllPreviews('ru')
    return <AllStoritesPage previews={previews} />
}