import { HomeButton, Language } from "@/components/Buttons"
import { TextCard } from "@/components/Cards"
import { PixelPage } from "@/components/PixelPage"
import { href } from "@/utils/refs"
import { TextPostMap } from "@/utils/text"
import Link from "next/link"

export function AllStoritesPage({ previews, language }: {
    previews: TextPostMap,
    language?: Language,
}) {
    let pairs = Object.entries(previews)
        .sort(([, a], [, b]) => b?.date?.localeCompare(a?.date ?? '') ?? 0)
    return <PixelPage
    >
        <div className="flex flex-col items-center justify-start w-full">
            <div className="flex flex-row flex-wrap content-start max-w-collection gap-stn p-stn">
                {pairs.map(([id, story], idx) =>
                    <Link key={idx} href={href('text', { id })}>
                        <TextCard post={story} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <HomeButton language={language} />
            </nav>
        </div>
    </PixelPage>
}