import { PixelPage } from "@/components/PixelPage";
import { TextBlock } from "@/components/TextBlock";
import { useQuery } from "@/utils/query";
import { href } from "@/utils/refs";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

export default function AboutPage() {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <AboutCard>
            <h1>Кто ты такой и что это за буква җ?</h1>
            <p>{`Ладно, вообще меня зовут Антон Шакирзянов. Буква "җ" взята из татарской версии кирилицы, вот отсюда: "Шөкер Җан".`}</p>
            <p>Я пишу <Link href={href('text', { hue })}>рассказы</Link>, выдуманные и не совсем. А еще я увлекаюсь генеративным искусством: создаю <Link href={href('sketch', { hue })}>формы и плакаты</Link> из них.</p>
            <p>У меня есть <Link href='https://instagram.com/ashakirzianov'>инстаграмм</Link> и <Link href='https://t.me/ashakirzianov_live'>телеграмм</Link>.</p>
        </AboutCard>
    </PixelPage>
}

export function AboutCard({ children }: {
    children: ReactNode,
}) {
    return <>
        <div className="container pixel-shadow">
            <div className="content pixel-corners">
                <TextBlock font="var(--font-pixel)">
                    {children}
                </TextBlock>
            </div>
        </div>
        <style jsx>{`
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100vw;
            padding: 10pt;
        }
        .content {
            background-color: var(--paper-light);
            color: var(--foreground-light);
            max-width: min(540pt, 100%);
        }
        `}</style>
    </>
}