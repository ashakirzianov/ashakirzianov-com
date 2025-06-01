import { PixelPage } from "@/components/PixelPage"
import { href } from "@/utils/refs"
import { AboutCard, AboutLink } from "@/components/About"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: 'Who is Andjan?',
    description: 'I am Anton Shakirzianov and this is my personal page',
})

export default async function AboutPage({ searchParams }: {
    searchParams: Promise<{ hue?: number }>
}) {
    const { hue } = await searchParams
    return <PixelPage hue={hue}>
        <AboutCard>
            <h1>Кто ты такой и что это за буква җ?</h1>
            <p>{`Ладно, вообще меня зовут Антон Шакирзянов. Буква "җ" взята из татарской версии кирилицы, вот отсюда: "Шөкер Җан".`}</p>
            <p>Я пишу <AboutLink href={href('text', { hue })}>рассказы</AboutLink>, выдуманные и не совсем. А еще я увлекаюсь генеративным искусством: создаю <AboutLink href={href('sketch', { hue })}>формы и плакаты</AboutLink> из них.</p>
            <p>У меня есть <AboutLink href='https://instagram.com/ashakirzianov'>инстаграмм</AboutLink> и <AboutLink href='https://t.me/ashakirzianov_live'>телеграмм</AboutLink>.</p>
        </AboutCard>
    </PixelPage>
}