import { getAllPreviews } from "@/utils/text"
import { AllStoritesPage } from "../shared"

export default async function AllStorites() {
    let previews = await getAllPreviews('en')
    return <AllStoritesPage previews={previews} language="en" />
}