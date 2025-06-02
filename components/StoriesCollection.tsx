import { HomeButton, Language } from '@/components/Buttons'
import { TextCard } from '@/components/Cards'
import { PixelPage } from '@/components/PixelPage'
import { href } from '@/utils/refs'
import { TextPostMap } from '@/utils/text'
import Link from 'next/link'

export function StoriesCollection({ previews, language, hue }: {
    previews: TextPostMap,
    language?: Language,
    hue: number | undefined,
}) {
    const pairs = Object.entries(previews)
    return <PixelPage hue={hue}>
        <div className="flex flex-col items-center justify-start w-full">
            <div className="flex flex-row flex-wrap content-start max-w-collection gap-stn p-stn">
                {pairs.map(([id, story], idx) =>
                    <Link key={idx} href={href('text', { id })}>
                        <TextCard post={story} />
                    </Link>
                )}
            </div>
            <nav className="navigation">
                <HomeButton language={language} hue={hue} />
            </nav>
        </div>
    </PixelPage>
}