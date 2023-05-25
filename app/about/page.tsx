import { PixelPage } from "@/components/Pages"
import { href } from "@/utils/refs"
import { AboutCard, AboutLink } from "./shared"
import { Metadata } from "next"
import { buildMetadata } from "@/utils/metadata"

export const metadata: Metadata = buildMetadata({
    title: 'Who is Andjan?',
    description: 'I am Anton Shakirzianov and this is my personal page',
})

export default function AboutPage() {
    return <PixelPage>
        <AboutCard>
            <h1>Кто ты такой и что это за буква җ?</h1>
            <p>{`Ладно, вообще меня зовут Антон Шакирзянов. Буква "җ" взята из татарской версии кирилицы, вот отсюда: "Шөкер Җан".`}</p>
            <p>Я пишу <AboutLink href={href('text')}>рассказы</AboutLink>, выдуманные и не совсем. А еще я увлекаюсь генеративным искусством: создаю <AboutLink href={href('sketch')}>формы и плакаты</AboutLink> из них.</p>
            <p>У меня есть <AboutLink href='https://instagram.com/ashakirzianov'>инстаграмм</AboutLink> и <AboutLink href='https://t.me/ashakirzianov_live'>телеграмм</AboutLink>.</p>
        </AboutCard>
    </PixelPage>
}