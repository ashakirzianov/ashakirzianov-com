import { getAllPreviews } from "@/utils/text"
import { MainPage } from "./client"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: "Анҗан",
    description: "Сайт с буквами и картинками",
})

export default async function Page({ searchParams }: {
    searchParams: Promise<{ hue?: number }>
}) {
    const { hue } = await searchParams
    let previews = await getAllPreviews()
    return <MainPage previews={previews} hue={hue} />
}