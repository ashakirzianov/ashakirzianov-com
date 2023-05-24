import { AllStoritesPage } from "@/components/Pages"
import { getAllPreviews } from "@/utils/text"

export default async function AllStorites() {
    let previews = await getAllPreviews('en')
    return <AllStoritesPage previews={previews} language="en" />
}