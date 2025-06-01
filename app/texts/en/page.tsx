import { getAllPreviews } from "@/utils/text"
import { AllStoritesPage } from "../shared"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: 'All Short Stories',
    description: 'Page with all short stories',
})

export default async function AllStorites({ searchParams }: {
    searchParams: Promise<{ hue?: number }>
}) {
    const { hue } = await searchParams
    let previews = await getAllPreviews('en')
    return <AllStoritesPage previews={previews} language="en" hue={hue} />
}