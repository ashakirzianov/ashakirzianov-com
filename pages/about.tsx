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
            <p>Я пишу <AboutLink href={href('text', { hue })}>рассказы</AboutLink>, выдуманные и не совсем. А еще я увлекаюсь генеративным искусством: создаю <AboutLink href={href('sketch', { hue })}>формы и плакаты</AboutLink> из них.</p>
            <p>У меня есть <AboutLink href='https://instagram.com/ashakirzianov'>инстаграмм</AboutLink> и <AboutLink href='https://t.me/ashakirzianov_live'>телеграмм</AboutLink>.</p>
        </AboutCard>
    </PixelPage>
}

export function AboutLink({ href, children }: {
    href: string,
    children: ReactNode,
}) {
    return <Link href={href} style={{
        color: 'skyblue',
    }}>
        {children}
    </Link>
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