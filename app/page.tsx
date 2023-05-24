import { getAllPreviews } from "@/utils/text"
import { Main } from "./client"

export default async function Page() {
    let previews = await getAllPreviews()
    return <Main previews={previews} />
}