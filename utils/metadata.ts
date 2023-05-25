import { Metadata } from "next"

export function buildMetadata({ title, description }: {
    title: string,
    description: string,
}): Metadata {
    return {
        title, description,
        openGraph: { title, description },
        twitter: { title, description },
    }
}