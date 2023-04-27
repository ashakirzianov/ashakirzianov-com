import { PixelPage } from "@/components/PixelPage";
import { TextBlock } from "@/components/TextBlock";
import { useQuery } from "@/utils/query";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
    let { hue } = useQuery();
    return <PixelPage hue={hue}>
        <Head>
            <title>Who is Andjan?</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="container pixel-shadow">
            <div className="content pixel-corners">
                <TextBlock font="var(--font-pixel)">
                    <h1>Кто ты такой и что это за буква җ?</h1>
                    <p>{`Ладно, вообще меня зовут Антон Шакирзянов. Буква "җ" взята из татарской версии кирилицы, вот отсюда: "Шөкер Җан".`}</p>
                    <p>Я пишу <Link href='/stories'>рассказы</Link>, выдуманные и не совсем. А еще я увлекаюсь генеративным искусством: создаю <Link href={`/posters?hue=${hue}`}>формы и плакаты</Link> из них.</p>
                    <p>У меня есть <Link href='https://instagram.com/ashakirzianov'>инстаграмм</Link> и <Link href='https://t.me/ashakirzianov_live'>телеграмм</Link>.</p>
                </TextBlock>
            </div>
        </div>
        <style jsx>{`
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .content {
            margin: 10pt;
            background-color: var(--paper-light);
            color: var(--foreground-light);
            max-width: min(540pt, 100%);
        }
        `}</style>
    </PixelPage>
}